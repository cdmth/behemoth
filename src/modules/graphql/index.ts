import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers} from 'merge-graphql-schemas'
import { ApolloServer } from 'apollo-server-express'

import { validateAuthorization } from '../firebase/index'
import customerSchema from './customer/customer-schema' 
import customerResolvers from './customer/customer-resolvers'
import entrySchema from './entry/entry-schema'
import entryResolvers from './entry/entry-resolvers'
import projectSchema from './project/project-schema'
import projectResolvers from './project/project-resolvers'
import workerSchema from './worker/worker-schema'
import workerResolvers from './worker/worker-resolvers'
import projectWorkersSchema from './projectWorkers/projectWorkers-schema'
import projectWorkersResolers from './projectWorkers/projectWorkers-resolvers'
import billSchema from './bill/bill-schema'
import billResolvers from './bill/bill-resolvers'
import loginSchema from './login/login-schema'
import loginResolvers from './login/login-resolvers'

const allSchemas = [
    customerSchema,
    entrySchema,
    projectSchema,
    workerSchema,
    projectWorkersSchema,
    billSchema,
    loginSchema
]

const allResolvers = [
    customerResolvers,
    entryResolvers,
    projectResolvers,
    workerResolvers,
    projectWorkersResolers,
    billResolvers,
    loginResolvers
]

export const typeDefs = mergeTypes(allSchemas, { all: true })
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

export const server = new ApolloServer({ 
    schema, 
    context: async ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';
    
    // try to retrieve a user with the token
    const user = await validateAuthorization(token);
    
    // add the user to the context
    return { user };
  }
})