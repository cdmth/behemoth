import { getWorkersByProjectId, setChildEntity, deleteEntity } from '../firebase'
import { pubsub } from '../firebase/pubsubber'

const path: string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        getWorkersByProjectId: (_, { projectId }: { projectId: string }) => getWorkersByProjectId(path, projectId),
    },
    Mutation: {
        addWorkerToProject: (_, args) => {
            const { projectId, workerId } = args
            return setChildEntity(path + '/' + projectId, workerId, args)
        },
        removeWorkerFromProject: async (_, { workerId, projectId }: { workerId: string, projectId: string }) => {
            try {
                await deleteEntity(path + '/' + projectId, workerId)
                return {
                    message: 'Someone got fired'
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Subscription: {
        projectWorkers: {
            subscribe: () => pubsub.asyncIterator('projectWorkers')
        }
    }
}

export default projectWorkersResolvers