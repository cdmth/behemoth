import * as moment from 'moment'

import { getEntitiesByValue, pushEntity } from '../../firebase'
import Entries from '../entry/entry-resolvers'

const path : string = 'bills'

const billResolvers = {
    Query: {
        getBillsByCustomerId: (_, { customerId } : { customerId: string }) => getEntitiesByValue(path, 'customerId', customerId)
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

          return pushEntity(path, args)
        }
    }
}

export default billResolvers