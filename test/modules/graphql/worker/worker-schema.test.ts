import { typeDefs } from '../../../../src/modules/graphql'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { worker, mocks } from '../test-data'

const workersQuery = `
query {
  workers {
    name
    projects {
      name
    }
    entries {
      description
    }
  }
}
`

const queryAllWorkers = {
  id: 'Query all workers',
  query: workersQuery,
  variables: { },
  context: { },
  expected: { data: { workers: [worker, worker] } }
}

describe('Testing Worker queries against schema', () => {
  const cases = [queryAllWorkers]
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