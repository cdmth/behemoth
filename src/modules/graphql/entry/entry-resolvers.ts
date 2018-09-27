import * as moment from 'moment'

import { getEntity, getEntities, setEntity, pushEntity, updateEntity, deleteEntity, getEntitiesByValue, getEntitiesByValueAndTimeRange } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

import Bills from '../bill/bill-resolvers'
import Projects from '../project/project-resolvers'
import Workers from '../worker/worker-resolvers'
import ProjectWorkers from '../projectWorkers/projectWorkers-resolvers'

const path: string = 'entries'

const entryResolvers = {
  Query: {
    entry: (_, _id) => getEntity(path, _id),
    entries: () => getEntities(path),
    entriesByProjectId: (_, args) => getEntitiesByValue(path, 'projectId', args.projectId),
    entriesByWorkerId: (_, args) => getEntitiesByValue(path, 'workerId', args.workerId),
    entriesByBillId: (_, args) => getEntitiesByValue(path, 'billId', args.billId),
    entriesByProjectIdAndTimeRange: (projectId, start, end) => getEntitiesByValueAndTimeRange(path, 'start', start, 'end', end, { 'projectId': projectId })
  },
  Entry: {
    bill: (entry) => {
      return Bills.Query.bill(undefined, { billId: entry.billId })
    },
    project: (entry) => {
      return Projects.Query.project(undefined, { _id: entry.projectId })
    },
    worker: (entry) => {
      return Workers.Query.worker(undefined, { _id: entry.workerId })
    }
  },
  Mutation: {
    createEntry: (_, args) => {
      return ProjectWorkers.Query.workerByProjectAndWorkerId(args.projectId, args.workerId).then(worker => {  
        const start = moment(args.start)
        const end = moment(args.end)
        const price = worker.rate * moment.duration(end.diff(start)).asHours()
        pushEntity(path, Object.assign({ price: price }, args))
      })
    },
    updateEntry: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
    deleteEntry: async (_, { _id }: { _id: string }) => {
      try {
        await deleteEntity(path, _id)
        return {
          message: 'Entry deleted, id: ' + _id
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Subscription: {
    entries: {
      subscribe: () => pubsub.asyncIterator('entries')
    }
  }
}

export default entryResolvers