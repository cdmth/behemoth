import * as moment from 'moment'

import { getEntity, getEntitiesByValue, pushEntity, getEntities, updateMultiPathEntity } from '../../firebase'
import Entries from '../entry/entry-resolvers'

const path: string = 'bills'
const entryPath: string = 'entries'

const billResolvers = {
  Query: {
    bill: (_, args) => getEntity(path, args.billId),
    billsByCustomerId: (customerId) => getEntitiesByValue(path, 'customerId', customerId),
    billsByProjectId: (projectId) => getEntitiesByValue(path, 'projectId', projectId),
    bills: () => getEntities(path)
  },
  Bill: {
    entries: (bill) => {
      return Entries.Query.entriesByBillId(undefined, {billId: bill._id})
    }
  },
  Mutation: {
    createBill: async (_, args) => {
      const entries = []

      let hours = 0
      let price = 0
      let workers = []

      // Get Entries by project ID
      const query = await Entries.Query.entriesByProjectIdAndTimeRange(args.projectId, args.billingPeriodStart, args.billingPeriodEnd)

      query.forEach(entry => {
        const start = moment(entry.start)
        const end = moment(entry.end)

        hours += moment.duration(end.diff(start)).asHours()
        price += entry.price

        // Get Workers by worker ID
        if (workers.indexOf(entry.workerId) === -1) {
          workers.push(entry.workerId)
        }

        entries.push(entry)
      })

      // Get Worker salary
      // const projectWorkers = await ProjectWorkers.Query.getWorkersByProjectId(_, args.projectId)


      args.hours = hours
      args.price = price
      args.status = 'draft'

      const updateObject = {}

      // create new bill and then add relation that entries belong to given bill
      await pushEntity(path, args).then(bill => {
        entries.forEach(entry => {
          updateObject[`${entryPath}/${entry._id}/billId`] = bill._id
        })
      })
      
      return updateMultiPathEntity(updateObject)
    }
  }
}

export default billResolvers