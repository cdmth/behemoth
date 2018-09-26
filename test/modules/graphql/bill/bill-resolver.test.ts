import * as firebase from '../../../../src/modules/firebase'
import billResolvers from '../../../../src/modules/graphql/bill/bill-resolvers'
import { testId, testString, testId2 } from '../test-data'
import Entries from '../../../../src/modules/graphql/entry/entry-resolvers'

describe('Bill queries and mutations', () => {
  const obj = {}
  const resultMock = { _id: testId, status: testString, entries: { description: testString } }

  const createBillMock = { customerId: testId, 
    projectId: testId, 
    description: testString, 
    billingPeriodStart: '2018-09-24T08:00:00.000Z',
    billingPeriodEnd: '2018-09-28T16:30:00.000Z' 
  }

  const correctPriceHoursMock = Object.assign({price: 800, hours: 10}, createBillMock)

  const multiPathMock = {
    'entries/1234/billId': '1234',
    'entries/4321/billId': '1234'
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
    firebase.pushEntity = jest.fn().mockImplementation(() => {
      let promise = new Promise((resolve, reject) => {
        resolve(resultMock)
      })
      return promise
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
    firebase.updateMultiPathEntity = jest.fn((updateObject) => {
      let promise = new Promise((resolve, reject) => {
        resolve(updateObject)
      })
      return promise
    })

    Entries.Query.entriesByProjectIdAndTimeRange = jest.fn().mockImplementation(() => {
      let promise = new Promise((resolve, reject) => {
        const entry1 = {
          _id: testId,
          start: '2018-09-24T08:00:00.000Z',
          end: '2018-09-24T13:00:00.000Z',
          price: 400
        }
        const entry2 = {
          _id: testId2,
          start: '2018-09-25T08:00:00.000Z',
          end: '2018-09-25T13:00:00.000Z',
          price: 400
        }
        resolve([entry1, entry2])
      })
      
      return promise
    })
  })
  
  test('query bill', () => {
    const args = { _id: testId }
    const result = billResolvers.Query.bill(obj, args)
    expect(result).toMatchObject(resultMock)
  })

  test('query bills', () => {
    const result = billResolvers.Query.bills()
    expect(result).toMatchObject([resultMock, resultMock])
  })

  //test('create bill and make sure price and ours are correct', () => {
  //  const args = createBillMock
  //  const result = billResolvers.Mutation.createBill(obj, args)
    // @ts-ignore
    // expect(firebase.pushEntity.mock.calls[0][0]).toEqual(correctPriceHoursMock)
  //  expect(result).toMatchObject(multiPathMock)
  //})
})