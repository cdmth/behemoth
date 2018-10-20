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
    entries: [Entry]
    project: Project
    customer: Customer
    billDate: String
  }

  type Unbilled {
    project: Project
    entries: [Entry]
  }

  type Query {
    bill(billId: String!): Bill
    billsByCustomerId(customerId: String): [Bill]
    billsByProjectId(projectId: String): [Bill]
    bills: [Bill]
    unbilledEntriesInProjects: [Unbilled]
  }

  type Mutation {
    createBill(customerId: String!, projectId: String!, billingPeriodStart: String!, billingPeriodEnd: String!): Bill
    createBillFromUnbilled(projectId: String!): Bill
    deleteBill(_id: String!): Bill
  }
`

export default billSchema