const entrySchema = 
`
  type Status {
    message: String!
  }

  type Entry {
    projectId: String!
    start: Int
    end: Int
    description: String
}

  type Query {
    entry(projectId: String!): Entry
    entries: [Entry]
  } 

  type Mutation {
    createEntry(
      projectId: String!
      start: Int
      end: Int
      description: String
    ): Entry

    updateEntry(
      _id: String!
      startAt: String
      endAt: String
      description: String
    ): Entry

    deleteEntry(_id: String!): Status
  }
`

export default entrySchema