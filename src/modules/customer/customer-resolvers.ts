import { getEntity, getEntities, insertEntity, updateEntity, deleteEntity } from '../firebase'

const path : string = 'customers'

const customerResolvers = {
    Query: {
        customer: (_, { _id } : { _id : string}) => getEntity(path, _id),
        customers: () => getEntities(path)
    },
    Mutation: {
        createCustomer: (_, args) => insertEntity(path, args),
        updateCustomer: (_, { _id, ...rest }: { _id: string }) => updateEntity(path, _id, rest),
        deleteCustomer: async (_, { _id } : { _id: string }) => {
            try {
                await deleteEntity(path, _id)
                return {
                    message: 'Customer deleted, id: ' + _id
                } 
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}

export default customerResolvers