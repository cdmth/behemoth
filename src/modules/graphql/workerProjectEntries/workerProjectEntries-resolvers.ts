import { getEntities, setEntity } from '../../firebase'
import { pubsub } from '../../firebase/pubsubber'

const path: string = 'workerProjectEntries'

const workerProjectEntriesResolvers = {
    Query: {
      getWorkerProjectEntries: async (_, { workerId, projectId }: { workerId: string, projectId:string }) => {
        const entities = await getEntities(`${path}/${workerId}/${projectId}`)
        return entities            
      }
    },
    Mutation: {
        addWorkerProjectEntry: (_, args) => {
          const { workerId, projectId, ...rest } = args
          return setEntity(`${path}/${workerId}/${projectId}`, rest)
        }
    },
    Subscription: {
        workerProjectEntries: {
            subscribe: () => pubsub.asyncIterator('workerProjectEntries')
        }
    }
}

export default workerProjectEntriesResolvers