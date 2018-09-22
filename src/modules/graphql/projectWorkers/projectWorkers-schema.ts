const projectWorkersSchema = `
  type Status {
    message: String!
  }

  type ProjectWorker {
    workerId: String
    name: String
    salary: Float
  }

  type Query {
    getWorkersByProjectId(projectId: String!): [ProjectWorker]
  }

  type Mutation {
    addWorkerToProject(
      workerId: String!,
      projectId: String!,
      name: String
    ): ProjectWorker

    deleteWorkerFromProject(
      workerId: String!, 
      projectId: String!
    ): Status
  }

  type Subscription {
    projectWorkers: [ProjectWorker]
  }
`

export default projectWorkersSchema