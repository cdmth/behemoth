const workerProjectEntriesSchema = `
  type WorkerProjectEntry {
    description: String,
    end: String,
    start: String
  }

  type Query {
    getWorkerProjectEntries(workerId: String!, projectId: String!): [Entry]
  }

  type Mutation {
    addWorkerProjectEntry(workerId: String!, projectId: String!, entryId: String!): WorkerProjectEntry
  }

  type Subscription {
    workerProjectEntries: [Entry]
  }
`

export default workerProjectEntriesSchema