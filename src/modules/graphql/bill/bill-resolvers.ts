import * as moment from 'moment'

import { getEntity, getEntitiesByValue, pushEntity, getEntities } from '../../firebase'
import Entries from '../entry/entry-resolvers'

const path : string = 'bills'

const billResolvers = {
    Query: {
        getBill: async (billId) => {
            const res = await getEntity(path, billId)
            console.log(res)
            return res
        },
        getBillsByCustomerId: (_, { customerId } : { customerId: string }) => getEntitiesByValue(path, 'customerId', customerId),
        getBills: () => getEntities(path)
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