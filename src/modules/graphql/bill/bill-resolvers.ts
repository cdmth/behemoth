import * as moment from "moment";

import {
  getEntity,
  getEntitiesByValue,
  pushEntity,
  getEntities,
  updateMultiPathEntity,
  getEntitiesByValueNotExisting,
  deleteEntity
} from "../../firebase";
import Entries from "../entry/entry-resolvers";
import Projects from "../project/project-resolvers";
import Customers from "../customer/customer-resolvers";

const path: string = "bills";
const entryPath: string = "entries";

const billResolvers = {
  Query: {
    bill: (_, args) => getEntity(path, args.billId),
    billsByCustomerId: customerId =>
      getEntitiesByValue(path, "customerId", customerId),
    billsByProjectId: projectId =>
      getEntitiesByValue(path, "projectId", projectId),
    bills: () => getEntities(path),
    unbilledEntriesInProjects: async () => {
      let entries = await getEntitiesByValueNotExisting('entries', 'billId')

      // Find unique project IDs
      let projectIds = []

      entries.forEach(entry => {
        if(!projectIds.includes(entry.projectId)) {
          projectIds.push(entry.projectId)
        }
      })

      let unbilledObject = await Promise.all(projectIds.map( async (project) => {
        let filteredEntries = entries.filter(entry => entry.projectId === project)
        return {
          project: await Projects.Query.project(undefined, { _id: project }),
          entries: filteredEntries
        }
      }))

      return unbilledObject
    }
  },
  Bill: {
    entries: bill => {
      return Entries.Query.entriesByBillId(undefined, { billId: bill._id });
    },
    project: bill => {
      return Projects.Query.project(undefined, { _id: bill.projectId });
    },
    customer: bill => {
      return Customers.Query.customer(undefined, { _id: bill.customerId }, undefined);
    }
  },
  Mutation: {
    createBill: async (_, args) => {
      const entries = [];

      let hours = 0;
      let price = 0;
      let workers = [];

      // Get Entries by project ID
      const query = await Entries.Query.entriesByProjectIdAndTimeRange(
        undefined,
        { ...args, start: args.billingPeriodStart, end: args.billingPeriodEnd }
      );

      query.forEach(entry => {
        if (!entry.billId) {
          const start = moment(entry.start);
          const end = moment(entry.end);

          hours += moment.duration(end.diff(start)).asHours();
          price += entry.price;

          // Get Workers by worker ID
          if (workers.indexOf(entry.workerId) === -1) {
            workers.push(entry.workerId);
          }

          entries.push(entry);
        }
      });

      // Get Worker salary
      // const projectWorkers = await ProjectWorkers.Query.getWorkersByProjectId(_, args.projectId)

      args.hours = hours;
      args.price = price;
      args.status = "draft";
      args.billDate = moment().toISOString()

      const updateObject = {};

      // create new bill and then add relation that entries belong to given bill
      await pushEntity(path, args).then(bill => {
        console.log("THIS IS BILL", bill)
        entries.forEach(entry => {
          updateObject[`${entryPath}/${entry._id}/billId`] = bill._id;
        });
      });

      return updateMultiPathEntity(updateObject);
    },
    createBillFromUnbilled: async (_, args) => {
      let earliest;
      let latest;
      let entries = []
      let hours = 0;
      let price = 0;
      let workers = [];

      // Get Entries by project ID
      const query = await Entries.Query.entriesByProjectId(
        undefined,
        { projectId: args.projectId }
      );

      console.log("QUERY", query)

      query.forEach(entry => {
        if (entry.projectId === args.projectId && !entry.billId) {
          const start = moment(entry.start);
          const end = moment(entry.end);

          earliest ? null : earliest = start
          if(start < earliest) {
            earliest = start
          }

          latest ? null : latest = end
          if(end < latest) {
            earliest = start
          }

          hours += moment.duration(end.diff(start)).asHours();
          price += entry.price;

          // Get Workers by worker ID
          if (workers.indexOf(entry.workerId) === -1) {
            workers.push(entry.workerId);
          }

          entries.push(entry);
        }
      });

      // Get Worker salary
      // const projectWorkers = await ProjectWorkers.Query.getWorkersByProjectId(_, args.projectId)

      const project = await Projects.Query.project(_, {_id: args.projectId})

      args.hours = hours;
      args.price = price;
      args.status = "draft";
      args.billDate = moment().toISOString()
      args.billingPeriodStart = earliest.toISOString()
      args.billingPeriodEnd = latest.toISOString()
      args.customerId = project.customerId


      const updateObject = {};

      // create new bill and then add relation that entries belong to given bill
      await pushEntity(path, args).then(bill => {
        entries.forEach(entry => {
          updateObject[`${entryPath}/${entry._id}/billId`] = bill._id;
        });
      });

      return updateMultiPathEntity(updateObject);
    },
    deleteBill: async (_, { _id } : { _id: string }) => {
      try {
          // Get Entries by bill ID
          const query = await Entries.Query.entriesByBillId(
            undefined,
            { billId: _id }
          );

          let updateObject = {}

          query.forEach(entry => {
            updateObject[`${entryPath}/${entry._id}/billId`] = null;
          });

          console.log("REMOVE THIS", path, _id)

          updateMultiPathEntity(updateObject);
          await deleteEntity(path, _id)

          console.log(updateObject)

          return {
              message: 'Bill deleted, id: ' + _id
          } 
      } catch (err) {
          throw new Error(err)
      }
    }
  }
};

export default billResolvers;
