const customersSchema = 
    `
    type Status {
        message: String!
    }

    type Customer {
        _id: String
        businessId: String
        name: String
        projects: [Project]
        bills: [Bill]
    }

    type Query {
        customer(_id: String!): Customer
        customers: [Customer]
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
    }

    type Subscription {
        customers: [Customer]
    }
`

export default customersSchema