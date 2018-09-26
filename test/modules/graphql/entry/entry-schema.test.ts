import { typeDefs } from '../../../../src/modules/graphql'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { entry, mocks } from '../test-data'

const entriessQuery = `
query {
  entries {
    description
    bill {
      hours
    }
    project {
      name
    }
    worker {
      name
    }
  }
}
`

const queryAllEntries = {
  id: 'Query all entries',
  query: entriessQuery,
  variables: { },
  context: { },
  expected: { data: { entries: [entry, entry] } }
}

describe('Testing Entry queries against schema', () => {
  const cases = [queryAllEntries]
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