const projectSchema =
  `
  type Status {
    message: String!
  }

  type Project {
    _id: String
    name: String
    customerId: String
    bills: [Bill]
    entries: [Entry]
    workers: [Worker]
  }

  type Query {
    project(_id: String!): Project
    projects: [Project]
    projectsByCustomerId(customerId: String!): [Project]
  }

  type Mutation {
    createProject(
      name: String,
      customerId: String!
    ): Project

    updateProject(
      _id: String!,
      name: String
    ): Project

    deleteProject(_id: String!): Status

    addWorkerToProject(
      workerId: String!
      projectId: String!
    ): Status
  
    deleteWorkerFromProject(
      workerId: String!
      projectId: String!
    ): Status
  }

  type Subscription {
    projects: [Project]
  }
`

export default projectSchema