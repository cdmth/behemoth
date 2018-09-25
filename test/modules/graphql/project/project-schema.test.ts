import { typeDefs } from '../../../../src/modules/graphql'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { project, mocks } from '../test-data'

const projectsQuery = `
query {
  projects {
    name
    customerId
    bills {
      hours
    }
    entries {
      price
    }
    workers {
      name
    }
  }
}
`

const queryAllProjects = {
  id: 'Query all projects',
  query: projectsQuery,
  variables: { },
  context: { },
  expected: { data: { projects: [project, project] } }
}

describe('Testing Project queries against schema', () => {
  const cases = [queryAllProjects]
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