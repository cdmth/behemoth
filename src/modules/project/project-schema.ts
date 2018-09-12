const projectSchema =
  `
  type Status {
    message: String!
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
`

export default projectSchema