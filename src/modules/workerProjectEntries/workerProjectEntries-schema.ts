const workerProjectEntriesSchema = `
  type WorkerProjectEntries {
    projectId: String
    entries: [Entry]
  }

  type Query {
    getWorkerProjectEntries(workerId: String!, projectId: String!): WorkerProjectEntries
    getWorkerProjectsEntries(workerId: String!): [WorkerProjectEntries]
  }

  type Mutation {
    addWorkerProjectEntry(workerId: String!, projectId: String!, entryId: String!): WorkerProjectEntries
  }

  type Subscription {
    workerProjectEntries: [WorkerProjectEntries]
  }
`

export default workerProjectEntriesSchema