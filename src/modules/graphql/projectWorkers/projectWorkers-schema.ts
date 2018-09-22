const projectWorkersSchema = `
  type Query {
    workersByProjectId(projectId: String!): [Worker]
  }

  type Subscription {
    projectWorkers: [Worker]
  }
`

export default projectWorkersSchema