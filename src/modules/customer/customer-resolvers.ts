import { getEntity, getEntities, insertEntity, updateEntity, deleteEntity } from '../firebase'

const path = 'customers'

const customerResolvers = {
    //Date: GraphqlDate,
    Query: {
        customer: (_, { _id }) => getEntity(path, _id),
        customers: () => getEntities(path)
    },
    Mutation: {
        createCustomer: (_, args) => insertEntity(path, args),
        updateCustomer: (_, { _id, ...rest }) => updateEntity(path, _id, rest),
        deleteCustomer: async (_, { _id }) => {
            try {
                await deleteEntity(path, _id)
                return {
                    message: 'Customer deleted, id: ' + _id
                }
            } catch (err) {
                throw Error(err)
            }
        }
    }
}

export default customerResolvers