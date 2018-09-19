import { getEntities, setEntity, deleteEntity } from '../firebase'
import { pubsub } from '../firebase/pubsubber'

const path: string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        getWorkersByProjectId: async (_, { projectId }: { projectId: string }) => {
            const entities = await getEntities(`${path}/${projectId}`)
            const workers = []
            entities.forEach(entity => {
                const { _id, ...rest} = entity
                workers.push(Object.assign({workerId: _id}, rest))
            })
            return workers
        },
    },
    Mutation: {
        addWorkerToProject: (_, args) => {
            const { projectId, workerId, ...rest } = args
            return setEntity(`${path}/${projectId}/${workerId}`, rest)
        },
        deleteWorkerFromProject: async (_, { workerId, projectId }: { workerId: string, projectId: string }) => {
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