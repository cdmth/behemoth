import { getEntity, getEntities, pushEntity, updateEntity, deleteEntity } from '../firebase'
import Projects from '../project/project-resolvers'

import { pubsub } from '../firebase/pubsubber'
const path : string = 'customers'

const customerResolvers = {
    Query: {
        customer: (_, { _id } : { _id : string}) => getEntity(path, _id),
        customers: () => getEntities(path)
    },
    Customer: {
        projects: (customer) => {
            return Projects.Query.projectsByCustomerId(customer._id)
        }
    },
    Mutation: {
        createCustomer: (_, args) => pushEntity(path, args),
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
    },
    Subscription: {
        customers: {
            subscribe: () => pubsub.asyncIterator('customers')
        }
    }
}

export default customerResolvers