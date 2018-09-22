import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity, getEntitiesByValue, updateMultiPathEntity } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

import Bills from '../bill/bill-resolvers'
import Entries from '../entry/entry-resolvers'
import ProjectWorkers from '../ProjectWorkers/projectWorkers-resolvers'

const path : string = 'projects'
const projectWorkersPath : string = 'projectWorkers'
const workerProjectsPath : string = 'workerProjects'

const projectResolvers = {
    Query: {
        project: (_, args) => getEntity(path, args._id),
        projects: () => getEntities(path),
        projectsByCustomerId: (id) => getEntitiesByValue(path, 'customerId', id)
    },
    Project: {
        bills: (project) => {
            return Bills.Query.billsByProjectId(project._id)
        },
        entries: (project) => {
            return Entries.Query.entriesByProjectId(undefined, project._id)
        },
        workers: (project) => {
            return ProjectWorkers.Query.workersByProjectId(project._id)
        }
    },
    Mutation: {
        createProject: (_, args) => pushEntity(path, args),
        updateProject: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
        deleteProject: async (_, { _id } : { _id: string }) => {
            try {
                await deleteEntity(path, _id)
                return {
                    message: 'Project deleted, id: ' + _id
                } 
            } catch (err) {
                throw new Error(err)
            }
        },
        addWorkerToProject: async (_, args) => {
            let updateObject = {}
            const { projectId, workerId } = args
            updateObject[`${projectWorkersPath}/${projectId}/${workerId}`] = true
            updateObject[`${workerProjectsPath}/${workerId}/${projectId}`] = true
            await updateMultiPathEntity(updateObject)
            return {
                message: 'Worker added to project'
            }
        },
        deleteWorkerFromProject: async (_, { workerId, projectId }: { workerId: string, projectId: string }) => {
            try {
                let updateObject = {}
                updateObject[`${projectWorkersPath}/${projectId}/${workerId}`] = null
                updateObject[`${workerProjectsPath}/${workerId}/${projectId}`] = null
                await updateMultiPathEntity(updateObject)
                return {
                    message: 'Someone got fired'
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Subscription: {
        projects: {
            subscribe: () => pubsub.asyncIterator('projects')
        }
    }
}

export default projectResolvers