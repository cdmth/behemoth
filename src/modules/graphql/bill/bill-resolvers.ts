import * as moment from 'moment'

import { getEntity, getEntitiesByValue, pushEntity, getEntities } from '../../firebase'
import Entries from '../entry/entry-resolvers'

const path : string = 'bills'

const billResolvers = {
    Query: {
        bill: (_, args) => getEntity(path, args.billId),
        billsByCustomerId: (customerId) => getEntitiesByValue(path, 'customerId', customerId),
        billsByProjectId: (projectId) => getEntitiesByValue(path, 'projectId', projectId),
        bills: () => getEntities(path)
    },
    Mutation: {
        createBill: async (_, args) => {
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
            if(workers.indexOf(entry.workerId) === -1) {
                workers.push(entry.workerId)
            }
        })

        // Get Worker salary
        // const projectWorkers = await ProjectWorkers.Query.getWorkersByProjectId(_, args.projectId)


          args.hours = hours
          args.price = price
          args.status = 'draft'

          return pushEntity(path, args)
        }
    }
}

export default billResolvers