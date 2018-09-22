const projectWorkersSchema = `
  type Query {
    workersByProjectId(projectId: String!): [Worker]
  }
`

export default projectWorkersSchema