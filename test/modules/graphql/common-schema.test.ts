import { mockServer } from 'graphql-tools'
import { typeDefs } from '../../../src/modules/graphql'
import { mocks } from './test-data'

describe('Schema, type definitions for all schemas', () => {
  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs, mocks);
      await MockServer.query(`{ __schema { types { name } } }`);
    }).not.toThrow()
  })
})