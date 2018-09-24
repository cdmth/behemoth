import { typeDefs } from '../../../../src/modules/graphql'
import { makeExecutableSchema, addMockFunctionsToSchema, mockServer } from 'graphql-tools'
import { graphql } from 'graphql'

// @ts-ignore 
global.typeDefs = typeDefs

const queryOneCustomer = {
  id: 'Query One Customers',
  query: `
    query {
      customer (_id:"customer") {
          name
      }
    }
  `,
  variables: { },
  context: { },
  expected: { data: { customer: { name: 'Dog' } } }
}

const queryAllCustomers = {
  id: 'Query All Customers',
  query: `
    query {
      customers {
          name
      }
    }
  `,
  variables: { },
  context: { },
  expected: { data: { customers: [{ name: 'Dog' }, { name: 'Dog' }] } }
}

const mocks = {
  Boolean: () => false,
  ID: () => '1',
  Int: () => 1,
  Float: () => 12.34,
  String: () => 'Dog',
}

describe('Schema', () => {
  const cases = [queryOneCustomer, queryAllCustomers]
  
  const mockSchema = makeExecutableSchema({ typeDefs })

  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: mocks 
  })

  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs, mocks);
      await MockServer.query(`{ __schema { types { name } } }`);
    }).not.toThrow()
  })

  cases.forEach(obj => {
    const { id, query, variables, context: ctx, expected } = obj;

    test(`query: ${id}`, async () => {
      return await expect(
        graphql(mockSchema, query, null, { ctx }, variables)
      ).resolves.toEqual(expected)
    })
  })
})