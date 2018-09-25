import { typeDefs } from '../../../../src/modules/graphql'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { customer, mocks } from '../test-data'

export const customersQuery = `
query {
  customers {
      name
      businessId 
      projects {
        name
      }
      bills {
        hours
      }
  }
}
`

const queryAllCustomers = {
  id: 'Query all customers',
  query: customersQuery,
  variables: { },
  context: { },
  expected: { data: { customers: [customer, customer] } }
}

describe('Testing Customers query against schema', () => {
  const cases = [queryAllCustomers]
  const mockSchema = makeExecutableSchema({ typeDefs })

  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: mocks 
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