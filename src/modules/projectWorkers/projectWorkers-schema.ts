const projectWorkersSchema = `
  type Status {
    message: String!
  }

  type ProjectWorker {
    workerId: String
    name: String
  }

  type ProjectWorkers {
    projectId: String
    workers: [ProjectWorker]
  }

  type Query {
    getWorkersByProjectId(projectId: String!): ProjectWorkers
  }

  type Mutation {
    addWorkerToProject(
      workerId: String!,
      name: String, 
      projectId: String!
    ): ProjectWorkers

    removeWorkerFromProject(
      workerId: String!, 
      projectId: String!
    ): Status
  }

  type Subscription {
    projectWorkers: [ProjectWorkers]
  }
`

export default projectWorkersSchema