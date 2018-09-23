const billSchema = `
  type Bill {
    _id: String
    customerId: String!
    projectId: String!
    billingPeriodStart: String!
    billingPeriodEnd: String!
    hours: Float
    price: Float
    status: String
  }

  type Query {
    bill(billId: String!): Bill
    billsByCustomerId(customerId: String): [Bill]
    billsByProjectId(projectId: String): [Bill]
    bills: [Bill]
  }

  type Mutation {
    createBill(customerId: String!, projectId: String!, billingPeriodStart: String!, billingPeriodEnd: String!): Bill
  }
`

export default billSchema