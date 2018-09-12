import { getEntity, getEntities, insertEntity, updateEntity, deleteEntity } from '../firebase'

const path : string = 'projects'

const projectResolvers = {
    Query: {
        project: (_, { _id } : { _id : string }) => getEntity(path, _id),
        projects: () => getEntities(path)
    },
    Mutation: {
        createProject: (_, args) => insertEntity(path, args),
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
    }
}

export default projectResolvers