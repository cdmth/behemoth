import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers} from 'merge-graphql-schemas'
import { ApolloServer } from 'apollo-server-express'

import customerSchema from '../customer/customer-schema' 
import customerResolvers from '../customer/customer-resolvers'

const allSchemas = [
    customerSchema
]

const allResolvers = [
    customerResolvers
]

const typeDefs = mergeTypes(allSchemas, { all: true })
const resolvers = mergeResolvers(allResolvers, { all: true })

const schema = makeExecutableSchema({ typeDefs, resolvers })

export const server = new ApolloServer({ schema })