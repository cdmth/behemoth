const projectSchema =
  `
  type Status {
    message: String!
  }

  type Project {
    _id: String
    name: String
  }

  type Query {
    project(_id: String!): Project
    projects: [Project]
  }

  type Mutation {
    createProject(
      name: String,
      companyId: String
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