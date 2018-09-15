const projectSchema =
  `
  type Status {
    message: String!
  }

  type Project {
    _id: String
    name: String
    customerId: String
  }

  type Query {
    project(_id: String!): Project
    projects: [Project]
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
  }

  type Subscription {
    projects: [Project]
}
`

export default projectSchema