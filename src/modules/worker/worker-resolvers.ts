import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity, getEntitiesByValue } from '../firebase'
import { pubsub } from '../firebase/pubsubber'

const path : string = 'workers'

const workerResolvers = {
    Query: {
        worker: (_, { _id } : { _id : string }) => getEntity(path, _id),
        workers: () => getEntities(path)
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