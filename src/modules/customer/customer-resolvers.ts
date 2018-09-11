import * as firebaseFunctions from '../firebase'
//import * as GraphqlDate from 'graphql-date'

const customerResolvers = {
    //Date: GraphqlDate,
    Query: {
        customers: () => firebaseFunctions.getEntities('customers')
    }/*,
    Mutation: {
        createCustomer: (_, args) => Customer.create(args),
        updateCustomer: (_, {_id, ...rest}) => Customer.update(_id, rest, {new: true}),
        deleteCustomer: async (_, { _id }) => {
            try {
                await Customer.delete(_id)
                return {
                    message: 'Customer deleted, id: ' + _id
                }
            } catch (err) {
                throw Error(err)
            }
        }
    }*/
}

export default customerResolvers