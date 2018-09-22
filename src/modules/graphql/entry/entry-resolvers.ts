import { getEntity, getEntities, setEntity, pushEntity, updateEntity, deleteEntity, getEntitiesByValue, getEntitiesByValueAndTimeRange } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

import Bills from '../bill/bill-resolvers'
import Projects from '../project/project-resolvers'
import Workers from '../worker/worker-resolvers'

const path : string = 'entries'

const entryResolvers = {
    Query: {
        entry: (_, _id) => getEntity(path, _id),
        entries: () => getEntities(path),
        entriesByProjectId: (_, args) => getEntitiesByValue(path, 'projectId', args.projectId),
        entriesByWorkerId: (_, args) => getEntitiesByValue(path, 'workerId', args.workerId),
        entriesByProjectIdAndTimeRange: (projectId, start, end) => getEntitiesByValueAndTimeRange(path, 'start', start, 'end', end, {'projectId': projectId})
    },
    Entry: {
        bill: (entry) => {
            return Bills.Query.bill(undefined, {_id: entry.billId})
        },
        project: (entry) => {
            return Projects.Query.project(undefined, {_id: entry.projectId})
        },
        worker: (entry) => {
            return Workers.Query.worker(undefined, {_id: entry.workerId })
        }
    },
    Mutation: {
        createEntry: (_, args) => pushEntity(path, args),
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