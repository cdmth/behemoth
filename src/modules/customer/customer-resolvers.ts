import { getEntity, getEntities, insertEntity, updateEntity, deleteEntity } from '../firebase'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()
const path : string = 'customers'
const customerNotificationTopic = 'customerNotifications';
let notifications = [{label: "YOLO"}]

const customerResolvers = {
    Query: {
        customer: (_, { _id } : { _id : string}) => getEntity(path, _id),
        customers: () => getEntities(path),
        notifications: () => notifications
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
        },
        pushNotification: (root, args) => {
            const newNotification = { label: args.label }
            notifications.push(newNotification)
            pubsub.publish(customerNotificationTopic, {newNotification: newNotification})

            return newNotification
        }
    },
    Subscription: {
        newNotification: {
            subscribe: () => pubsub.asyncIterator(customerNotificationTopic)
        }
    }
}

export default customerResolvers