import * as firebase from '../../../../src/modules/firebase'

import customerResolvers from '../../../../src/modules/graphql/customer/customer-resolvers'

describe('Customer queries and mutations', () => {
  
  const obj = {}
  const resultMock  = { _id: '1234', name: 'Dog', businessId: 'Cat' }

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

  test('query customer', () => {
    const args = { _id: '1234' }
    const result = customerResolvers.Query.customer(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('query customers', () => {
    const result = customerResolvers.Query.customers()
    expect(result).toMatchObject([resultMock, resultMock])
  })

  test('create customer', () => {
    const args = { name: 'Dog', businessId: 'Cat'}
    const result = customerResolvers.Mutation.createCustomer(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('update customer', () => {
    const args = { _id: '1234', name: 'Dog', businessId: 'Cat'}
    const result = customerResolvers.Mutation.updateCustomer(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('delete customer', () => {
    const args = { _id: '1234'}
    const result = customerResolvers.Mutation.deleteCustomer(obj, args)
    expect(result).resolves.toMatchObject({message: 'Customer deleted, id: ' + args._id})
  })
})