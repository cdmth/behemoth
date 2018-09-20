import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity, getEntitiesByValue } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

const path : string = 'projects'

const projectResolvers = {
    Query: {
        project: (_, { _id } : { _id : string }) => getEntity(path, _id),
        projects: () => getEntities(path),
        projectsByCustomerId: (id) => getEntitiesByValue(path, 'customerId', id)
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
        }
    },
    Subscription: {
        projects: {
            subscribe: () => pubsub.asyncIterator('projects')
        }
    }
}

export default projectResolvers