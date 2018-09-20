const billSchema = `
  type Bill {
    _id: String
    customerId: String!
    projectId: String!
    billingPeriodStart: String!
    billingPeriodEnd: String!
    hours: Float
  }

  type Query {
    getBillsByCustomerId(customerId: String): [Bill]
  }

  type Mutation {
    createBill(customerId: String!, projectId: String!, billingPeriodStart: String!, billingPeriodEnd: String!): Bill
  }
`

export default billSchema