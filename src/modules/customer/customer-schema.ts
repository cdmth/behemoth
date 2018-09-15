const customersSchema = 
    `
    type Status {
        message: String!
    }

    type Notification {
        label: String
    }

    type Customer {
        _id: String
        businessId: String
        name: String
        projects: [Project]!
    }

    type Query {
        customer(_id: String!): Customer
        customers: [Customer]
        notifications: [Notification]
        livecustomers: [Customer]
        customersWithProjects: [Customer]
    }

    type Mutation {
        createCustomer(
            businessId: String
            name: String
        ): Customer

        updateCustomer(
            _id: String!
            businessId: String
            name: String
        ): Customer

        deleteCustomer(_id: String!): Status

        pushNotification(
            label: String
        ): Notification
    }

    type Subscription {
        newNotification: Notification
        customers: [Customer]
    }
`

export default customersSchema