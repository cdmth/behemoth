import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity, getEntitiesByValue, getEntitiesByValueAndTimeRange } from '../../firebase'

const path : string = 'entries'

const entryResolvers = {
    Query: {
        entry: (_, { _id } : { _id : string}) => getEntity(path, _id),
        entries: () => getEntities(path),
        entriesByProjectId: (_, { projectId } : { projectId : string}) => {
            console.log('projectId', projectId)
            return getEntitiesByValue(path, 'projectId', projectId)
        },
        entriesByProjectIdAndTimeRange: (projectId, start, end) => getEntitiesByValueAndTimeRange(path, 'start', start, 'end', end, {'projectId': projectId})
    },
    Mutation: {
        createEntry: (_, args) => pushEntity(path, args),
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