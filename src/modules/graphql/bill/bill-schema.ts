const billSchema = `
  type Bill {
    _id: String
    customerId: String!
    projectId: String!
    billingPeriodStart: String!
    billingPeriodEnd: String!
    hours: Float
    sum: Float
    status: String
  }

  type Query {
    getBill(billId: String!): Bill
    getBillsByCustomerId(customerId: String): [Bill]
    getBills: [Bill]
  }

  type Mutation {
    createBill(customerId: String!, projectId: String!, billingPeriodStart: String!, billingPeriodEnd: String!): Bill
  }
`

export default billSchema