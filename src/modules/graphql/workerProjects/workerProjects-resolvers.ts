import { getEntities } from '../../firebase'

import Worker from '../worker/worker-resolvers'

const path: string = 'workerProjects'

const workerProjectsResolvers = {
    Query: {
        projectsByWorkerId: async (projectId) => {
            const projects = []
            const workerIds = await getEntities(`${path}/${projectId}`)
            workerIds.forEach(workerId => {
                projects.push(Worker.Query.worker(undefined, {_id: workerId}))
            })
            return projects
        }
    }
}

export default workerProjectsResolvers