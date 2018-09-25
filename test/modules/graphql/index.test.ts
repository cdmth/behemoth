import { mockServer } from 'graphql-tools'
import { typeDefs } from '../../../src/modules/graphql'

// @ts-ignore 
global.typeDefs = typeDefs

export const testString = 'Dog'
export const testFloat = 12.23

export const mocks = {
  Float: () => testFloat,
  String: () => testString
}

export const nameObject = {
  name: testString
}

export const bill = {
  hours: testFloat
}

export const entry = {
  price: testFloat
}

export const project = {
  name: testString,
  customerId: testString,
  bills: [bill, bill],
  entries: [entry, entry],
  workers: [nameObject, nameObject]
}

export const customer = { 
  name: testString,
  businessId: testString,
  projects: [nameObject, nameObject],
  bills: [bill, bill]
}

describe('Schema, type definitions for all schemas', () => {
  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs, mocks);
      await MockServer.query(`{ __schema { types { name } } }`);
    }).not.toThrow()
  })
})