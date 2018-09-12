import Entry from './Entry'

const entrySchema = 
  Entry + 
  `
  type Status {
    message: String!
  }

  type Query {
    entry(_id: String!): Entry
    entries: [Entry]
  } 

  type Mutation {
    createEntry(
      startAt: String!,
      endAt: String,
      description: String
    ): Entry

    updateEntry(
      _id: String!,
      startAt: String,
      endAt: String,
      description: String
    ): Entry

    deleteEntry(_id: String!): Status
  }
`

export default entrySchema