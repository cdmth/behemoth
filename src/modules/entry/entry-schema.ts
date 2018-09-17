const entrySchema = 
`
  type Status {
    message: String!
  }

  type Entry {
    _id: String
    projectId: String!
    workerId: String!
    start: Int
    end: Int
    description: String
}

  type Query {
    entry(_id: String!): Entry
    entries: [Entry]
  } 

  type Mutation {
    createEntry(
      projectId: String!
      workerId: String!
      start: Int
      end: Int
      description: String
    ): Entry

    updateEntry(
      _id: String!
      projectId: String
      workerId: String
      startAt: String
      endAt: String
      description: String
    ): Entry

    deleteEntry(_id: String!): Status
  }
`

export default entrySchema