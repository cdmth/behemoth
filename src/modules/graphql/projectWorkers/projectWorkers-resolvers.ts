import { pubsub } from '../../firebase/pubsubber'
import { getRelations } from '../../firebase'
import Worker from '../worker/worker-resolvers'

const path: string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        workersByProjectId: async (projectId) => {
            const relations = await getRelations(`${path}/${projectId}`)
            const workers = []
            relations.forEach(relation => {
                const worker = Worker.Query.worker(undefined, { _id: relation }) 
                workers.push(worker)
            })
            return workers
        }
    },
    Subscription: {
        projectWorkers: {
            subscribe: () => pubsub.asyncIterator('projectWorkers')
        }
    }
}

export default projectWorkersResolvers