const entrySchema = 
`
  type Status {
    message: String!
  }

  type Entry {
    _id: String
    projectId: String!
    workerId: String!
    start: String
    end: String
    description: String
    price: Float
    bill: Bill
    project: Project
    worker: Worker
  }

  type Query {
    entry(_id: String!): Entry
    entries: [Entry]
    entriesByProjectId(projectId: String!): [Entry]
    entriesByWorkerId(workerId: String!): [Entry]
    entriesByBillId(billId: String!): [Entry]
    entriesByProjectIdAndTimeRange(projectId: String!, start: String!, end: String!): [Entry]
  } 

  type Mutation {
    createEntry(
      projectId: String!
      workerId: String!
      start: String
      end: String
      description: String
    ): Entry

    updateEntry(
      _id: String!
      projectId: String
      workerId: String
      start: String
      end: String
      description: String
    ): Entry

    deleteEntry(_id: String!): Status
  }

  type Subscription {
    entries: [Entry]
}
`

export default entrySchema