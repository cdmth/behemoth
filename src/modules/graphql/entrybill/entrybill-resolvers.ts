import { getEntity, pushEntity, updateEntity, deleteEntity } from '../../firebase'

import Bills from '../bill/bill-resolvers'

const path : string = 'entryBills'

const entryResolvers = {
    Query: {
      getBillByEntryId: async (_id) => {
        const entity = await getEntity(path, _id)
        console.log('entity', entity)
        return Bills.Query.getBill(entity.billId)
      }
    },
    Mutation: {
        createEntry: (_, args) => pushEntity(path, args),
        updateEntry: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
        deleteEntry: async (_, { _id } : { _id: string }) => {
            try {
                await deleteEntity(path, _id)
                return {
                    message: 'EntryBill deleted, id: ' + _id
                } 
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}

export default entryResolvers