import { pubsub } from '../../firebase/pubsubber'
import { getEntity, getRelations, updateEntity } from '../../firebase'
import Worker from '../worker/worker-resolvers'

const path: string = 'projectWorkers'

const projectWorkersResolvers = {
    Query: {
        workersByProjectId: async (_, args) => {
            let relations = await getRelations(`${path}/${args.projectId}`)
            return await relations.map(
                async (relation) => {
                    let worker = await Worker.Query.worker(undefined, { _id: relation._id })
                    worker = Object.assign({rate: relation.rate}, worker)
                    return worker
                })
        },
        workerByProjectAndWorkerId: async (projectId, workerId) => getEntity(`${path}/${projectId}`, workerId)
    },
    Mutation: {
        updateProjectWorker: (_, { projectId, workerId, ...rest }) => updateEntity(`${path}/${projectId}`, workerId, rest),
    },
    Subscription: {
        projectWorkers: {
            subscribe: () => pubsub.asyncIterator('projectWorkers')
        }
    }
}

export default projectWorkersResolvers