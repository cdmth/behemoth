import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers} from 'merge-graphql-schemas'
import { ApolloServer } from 'apollo-server-express'

import customerSchema from '../customer/customer-schema' 
import customerResolvers from '../customer/customer-resolvers'
import entrySchema from '../entry/entry-schema'
import entryResolvers from '../entry/entry-resolvers'
import projectSchema from '../project/project-schema'
import projectResolvers from '../project/project-resolvers'

const allSchemas = [
    customerSchema,
    entrySchema,
    projectSchema
]

const allResolvers = [
    customerResolvers,
    entryResolvers,
    projectResolvers
]

const typeDefs = mergeTypes(allSchemas, { all: true })
const resolvers = mergeResolvers(allResolvers, { all: true })

export const schema = makeExecutableSchema({ 
    typeDefs, 
    resolvers,
    //@ts-ignore
    playground: {
        endpoint: `http://localhost:3001/playground`,
        settings: {
          'editor.theme': 'light'
        }
      }
})

export const server = new ApolloServer({ schema })