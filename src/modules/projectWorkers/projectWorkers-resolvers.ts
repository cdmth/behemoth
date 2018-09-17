import { getEntity, insertEntity, insertChildEntity, deleteEntity, getChildren} from '../firebase'

const path : string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        getWorkersByProjectId: (_, { projectId } : { projectId : string }) => getChildren(path, projectId),
    },
    Mutation: {
        addWorkerToProject: (_, { workerId, name, projectId } : { workerId: string, name: string, projectId: string }) => insertChildEntity(path + '/' + projectId, workerId, name),
        removeWorkerFromProject: async (_, { workerId, projectId } : { workerId: string, projectId: string }) => {
            try {
                await deleteEntity(path + '/' + projectId, workerId)
                return {
                    message: 'Someone got fired'
                } 
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}

export default projectWorkersResolvers