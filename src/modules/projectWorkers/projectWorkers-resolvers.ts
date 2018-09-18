import { getRelationalEntities, setChildEntity, deleteEntity } from '../firebase'
import { pubsub } from '../firebase/pubsubber'

const path: string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        getWorkersByProjectId: (_, { projectId }: { projectId: string }) => {
            getRelationalEntities(path, projectId).then((res) => console.log("VASTAUS",res.children))
            return getRelationalEntities(path, projectId)
        },
    },
    ProjectWorkers: {
        projectId: (entities) => {
            return entities.parentId
        },
        workers: (entities) => {
            let workers = []
            entities.children.forEach(child => {
                const { childId, ...rest } = child
                workers.push(Object.assign({workerId: childId}, rest))
            })
            return workers
        }
    },
    Mutation: {
        addWorkerToProject: (_, args) => {
            const { projectId, workerId, ...rest } = args
            return setChildEntity(path, projectId, workerId, rest)
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