import * as firebase from '../../../../src/modules/firebase'
import entryResolvers from '../../../../src/modules/graphql/entry/entry-resolvers'
import ProjectWorkers from '../../../../src/modules/graphql/projectWorkers/projectWorkers-resolvers'
import { worker, testId, testString, testFloat } from '../test-data'

describe('Entry queries and mutations', () => {
  const obj = {}
  const resultMock = { _id: testId, description: testString, bill: { hours: testFloat }, project: { name: testString } }
  const mutationMock = { _id: testId, description: testString }

  const createEntryMock = { projectId: '1234', 
    workerId: '1234', 
    description: testString, 
    start: '2018-09-24T08:00:00.000Z',
    end: '2018-09-24T16:30:00.000Z' 
  }

  const correctPriceMock = Object.assign({price: 850}, createEntryMock)

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

    ProjectWorkers.Query.workerByProjectAndWorkerId = jest.fn().mockImplementation(() => {
      let promise = new Promise((resolve, reject) => {
        // @ts-ignore
        worker.rate = 100
        resolve(worker)
      })
      
      return promise
    })
  })

  test('query entry', () => {
    const args = { _id: testId }
    const result = entryResolvers.Query.entry(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('query entries', () => {
    const result = entryResolvers.Query.entries()
    expect(result).toMatchObject([resultMock, resultMock])
  })

  test('create entry and make sure price is correct', () => {
    const args = createEntryMock
    entryResolvers.Mutation.createEntry(obj, args).then(result => {
      // @ts-ignore
      expect(firebase.pushEntity.mock.calls[0][0]).toEqual(correctPriceMock)
      expect(result).toMatchObject(mutationMock)
    })
  })

  test('update entry', () => {
    const args = { _id: testId, description: testString }
    const result = entryResolvers.Mutation.updateEntry(obj, args)
    expect(result).toMatchObject(mutationMock)
  })

  test('delete entry', () => {
    const args = { _id: testId}
    const result = entryResolvers.Mutation.deleteEntry(obj, args)
    expect(result).resolves.toMatchObject({message: 'Entry deleted, id: ' + args._id})
  })
})