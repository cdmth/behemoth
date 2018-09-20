import { getEntity, getEntities, setEntity, pushEntity, updateEntity, deleteEntity, getEntitiesByValue, getEntitiesByValueAndTimeRange } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

import Entries from '../entrybill/entrybill-resolvers'

const path : string = 'entries'

const entryResolvers = {
    Query: {
        entry: (_, { _id } : { _id : string}) => getEntity(path, _id),
        entries: () => getEntities(path),
        entriesByProjectId: (_, { projectId } : { projectId : string}) => getEntitiesByValue(path, 'projectId', projectId),
        entriesByProjectIdAndTimeRange: (projectId, start, end) => getEntitiesByValueAndTimeRange(path, 'start', start, 'end', end, {'projectId': projectId})
    },
    Entry: {
        bill: (entry) => {
            console.log('entry', entry)
            return Entries.Query.getBillByEntryId(entry._id)
        }
    },
    Mutation: {
        createEntry: async (_, args) => {
            console.log('args', args)
            console.log('köpö', args._id)
            const result = await pushEntity(path, args)
            await setEntity(`entryBills/${result._id}`, {billId: ''})
            return result 
        },
        updateEntry: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
        deleteEntry: async (_, { _id } : { _id: string }) => {
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