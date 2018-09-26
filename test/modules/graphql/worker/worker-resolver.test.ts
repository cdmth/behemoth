import * as firebase from '../../../../src/modules/firebase'

import workerResolvers from '../../../../src/modules/graphql/worker/worker-resolvers'

describe('Worker queries and mutations', () => {
  const obj = {}
  const resultMock = {_id: '1234', name: 'Dog'}

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
      return Object.assign({_id: '1234'}, entity)
    })

    // @ts-ignore
    firebase.updateEntity = jest.fn((path, _id, entity) => {
      return Object.assign({_id: _id}, entity)
    })

    // @ts-ignore
    firebase.deleteEntity = jest.fn((path, id) => {
      return null
    })
  })

  test('query worker', () => {
    const args = { _id: '1234' }
    const result = workerResolvers.Query.worker(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('query workers', () => {
    const result = workerResolvers.Query.workers()
    expect(result).toMatchObject([resultMock, resultMock])
  })

  test('create worker', () => {
    const args = { name: 'Dog', businessId: 'Cat'}
    const result = workerResolvers.Mutation.createWorker(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('update worker', () => {
    const args = { _id: '1234', name: 'Dog', businessId: 'Cat'}
    const result = workerResolvers.Mutation.updateWorker(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('delete worker', () => {
    const args = { _id: '1234'}
    const result = workerResolvers.Mutation.deleteWorker(obj, args)
    expect(result).resolves.toMatchObject({message: 'Worker deleted, id: ' + args._id})
  })
})