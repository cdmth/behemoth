import { getRelationalEntities, setChildEntity, deleteEntity } from '../firebase'
import { pubsub } from '../firebase/pubsubber'

const path: string = 'workerProjectEntries'

const workerProjectEntriesResolvers = {
    Query: {
      getWorkerProjectEntries: (_, { workerId, projectId }: { workerId: string, projectId:string }) => {
        return getRelationalEntities(`${path}/${workerId}/${projectId}`, workerId)
      }
    },
    WorkerProjectEntries: {
      projectId: (entities) => {
        return entities.parentId
      },
      entries: (entities) => {
        return entities.children
      }
    },
    Mutation: {
        addWorkerProjectEntry: (_, args) => {
          const { workerId, projectId, ...rest } = args
          return setChildEntity(path, workerId, projectId, rest)
        }
    },
    Subscription: {
        workerProjectEntries: {
            subscribe: () => pubsub.asyncIterator('workerProjectEntries')
        }
    }
}

export default workerProjectEntriesResolvers