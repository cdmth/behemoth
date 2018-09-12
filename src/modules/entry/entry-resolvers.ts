import { getEntity, getEntities, insertEntity, updateEntity, deleteEntity } from '../firebase'

const path : string = 'entries'

const entryResolvers = {
    Query: {
        entry: (_, { _id }) => getEntity(path, _id),
        entries: () => getEntities(path)
    },
    Mutation: {
        createEntry: (_, args) => insertEntity(path, args),
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
    }
}

export default entryResolvers