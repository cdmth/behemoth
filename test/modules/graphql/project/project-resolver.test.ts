import * as firebase from '../../../../src/modules/firebase'
import projectResolvers from '../../../../src/modules/graphql/project/project-resolvers'
import { testId, testString, testString2, testId2 } from '../test-data'

describe('Project queries and mutations', () => {
  const obj = {}
  const resultMock = {_id: testId, name: testString}

  const workerAddedResultMock = {
    'projectWorkers/1234/4321': {
      'rate': '100'
    },
      'workerProjects/4321/1234': {
      'rate': '100',
    }
  }

  const workerRemovedResultMock = {
    'projectWorkers/1234/4321': null,
    'workerProjects/4321/1234': null
  }

  beforeAll(() => {
    // @ts-ignore
    firebase.getEntity = jest.fn((path, id) => {
      return resultMock
    })

    // @ts-ignore
    firebase.getEntities = jest.fn((path) => {
      return [resultMock, resultMock]
    })

     // @ts-ignore
     firebase.pushEntity = jest.fn((path, entity) => {
      return Object.assign({_id: testId}, entity)
    })

    // @ts-ignore
    firebase.updateEntity = jest.fn((path, _id, entity) => {
      return Object.assign({_id: _id}, entity)
    })

    // @ts-ignore
    firebase.deleteEntity = jest.fn((path, id) => {
      return null
    })

    // @ts-ignore
    firebase.updateMultiPathEntity = jest.fn(updateObject => {
      return null
    })
  })

  test('query project', () => {
    const args = { _id: testId }
    const result = projectResolvers.Query.project(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('query projects', () => {
    const result = projectResolvers.Query.projects()
    expect(result).toMatchObject([resultMock, resultMock])
  })

  test('create project', () => {
    const args = { name: testString, businessId: testString2}
    const result = projectResolvers.Mutation.createProject(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('update project', () => {
    const args = { _id: testId, name: testString, businessId: testString2}
    const result = projectResolvers.Mutation.updateProject(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('delete customer', () => {
    const args = { _id: testId}
    const result = projectResolvers.Mutation.deleteProject(obj, args)
    expect(result).resolves.toMatchObject({message: 'Project deleted, id: ' + args._id})
  })

  test('add worker to project', () => {
    const args = { projectId: testId, workerId: testId2, rate: '100' }
    const result = projectResolvers.Mutation.addWorkerToProject(obj, args)
    // @ts-ignore
    expect(firebase.updateMultiPathEntity.mock.calls[0][0]).toEqual(workerAddedResultMock)
    expect(result).resolves.toMatchObject({message: 'Worker added to project'})
  })

  test('remove worker from project', () => {
    const args = { workerId: testId2, projectId: testId }
    const result = projectResolvers.Mutation.deleteWorkerFromProject(obj, args)
    // @ts-ignore
    expect(firebase.updateMultiPathEntity.mock.calls[1][0]).toEqual(workerRemovedResultMock)
    expect(result).resolves.toMatchObject({message: 'Someone got fired'})
  })
})