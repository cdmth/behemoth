const workerSchema =`
  type Status {
    message: String!
  }

  type Worker {
    _id: String
    name: String
  }

  type Query {
    worker(_id: String!): Worker
    workers: [Worker]
  }

  type Mutation {
    createWorker(
      name: String
    ): Worker

    updateWorker(
      _id: String!,
      name: String
    ): Worker

    deleteWorker(_id: String!): Status
  }

  type Subscription {
    workers: [Worker]
  }
`

export default workerSchema