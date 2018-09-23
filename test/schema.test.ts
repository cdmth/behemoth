import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mockServer
} from 'graphql-tools'

import Faker from 'faker'

const fakeCustomer = {
  name: Faker::Company.name,
  businessId: Faker::Company.swedish_organisation_number
}

const createCustomer = {
  id: `Creates new Customer named ${fakeCustomer.name}`,
  mutation: `
    createCustomer(name: "${fakeCustomer.name}", businessId: "${fakeCustomer.businessId}") {
      _id: String
      businessId: String
      name: String
      projects: {
        _id
      }
      bills: {
        _id
      }
    }
  `,
  variables: { name: fakeCustomer.name, businessId: fakeCustomer.businessId },
  context: { },
  expected: {
    data: {
      createCustomer: {
        _id: "-LN2717wikALPrXtzS6E",
        businessId: fakeCustomer.businessId,
        name: fakeCustomer.name,
        projects: [],
        bills: []
      }
    }
  }
}

describe('Schema', () => {
  // Array of case types
  const cases = [createCustomer]
  
  const mockSchema = makeExecutableSchema({ typeDefs })

  // Here we specify the return payloads of mocked types
  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: {
      Boolean: () => false,
      ID: () => '1',
      Int: () => 1,
      Float: () => 12.34,
      String: () => 'Dog',
    }
  })

  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs)

      await MockServer.query(`{ __schema { types { name } } }`)
    }).not.toThrow()
  })

  cases.forEach(obj => {
    const { id, query, variables, context: ctx, expected } = obj

    test(`query: ${id}`, async () => {
      return await expect(
        graphql(mockSchema, query, null, { ctx }, variables)
      ).resolves.toEqual(expected)
    })
  })
})