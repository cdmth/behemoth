import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

import Entries from '../entry/entry-resolvers'
import WorkerProjects from '../workerProjects/workerProjects-resolvers'

const path : string = 'workers'

const workerResolvers = {
    Query: {
        worker: (_, args) => getEntity(path, args._id),
        workers: () => getEntities(path)
    },
    Worker: {
        projects: (worker) => {
            return WorkerProjects.Query.projectsByWorkerId(worker._id)
        },
        entries: (worker) => {
            return Entries.Query.entriesByWorkerId(worker._id)
        }
    },
    Mutation: {
        createWorker: (_, args) => pushEntity(path, args),
        updateWorker: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
        deleteWorker: async (_, { _id } : { _id: string }) => {
            try {
                await deleteEntity(path, _id)
                return {
                    message: 'Worker deleted, id: ' + _id
                } 
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Subscription: {
        workers: {
            subscribe: () => pubsub.asyncIterator('workers')
        }
    }
}

export default workerResolvers