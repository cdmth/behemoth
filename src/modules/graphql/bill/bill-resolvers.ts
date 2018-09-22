import * as moment from 'moment'

import { getEntity, getEntitiesByValue, pushEntity } from '../../firebase'
import Entries from '../entry/entry-resolvers'

const path : string = 'bills'

const billResolvers = {
    Query: {
        bill: (_, billId) => getEntity(path, billId),
        billsByCustomerId: (customerId) => getEntitiesByValue(path, 'customerId', customerId),
        billsByProjectId: (projectId) => getEntitiesByValue(path, 'projectId', projectId)
    },
    Mutation: {
        createBill: async (_, args) => {
          let hours = 0
          
          await Entries.Query.entriesByProjectIdAndTimeRange(args.projectId, args.billingPeriodStart, args.billingPeriodEnd).then(entries => {
            entries.forEach(entry => {
                const start = moment(entry.start)
                const end = moment(entry.end)
                hours += moment.duration(end.diff(start)).asHours()
              })
          })

          args.hours = hours
          args.status = 'draft'

          return pushEntity(path, args)
        }
    }
}

export default billResolvers