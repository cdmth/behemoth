const customersSchema = `
    type Status {
        message: String!
    }

    type Customer {
        businessId: String!
        name: String
    }

    type Query {
        customer(businessId: String!): Customer
        customers: [Customer]
    }

    type Mutation {
        createCustomer(
            businessId: String,
            name: String
        ): Customer

        updateCustomer(
            businessId: String!
            name: String
        ): Customer

        deleteCustomer(businessId: String!):Status
    }
`

export default customersSchema