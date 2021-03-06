const projectWorkersSchema = `
  type ProjectWorker {
    _id: String
    name: String
    rate: Float
  }

  type Query {
    workersByProjectId(projectId: String!): [ProjectWorker]
    workerByProjectAndWorkerId(projectId: String!, workerId: String!) : ProjectWorker
  }

  type Mutation {
    updateProjectWorker(projectId: String!, workerId: String!, rate: String): [ProjectWorker]
  }

  type Subscription {
    projectWorkers: [ProjectWorker]
  }
`

export default projectWorkersSchema