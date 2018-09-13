import * as express from 'express'
import * as cors from 'cors'
import constants from '../config/constants'
import { server, schema } from '../src/modules/graphql'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { createServer } from 'http'

const app = express()
app.use(cors())

if(process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

const path = '/api'

server.applyMiddleware({app, path})

const ws = createServer(app);

ws.listen(constants.PORT, () => {
  console.log(`Running on port ${constants.PORT}!`);

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/graphql',
  });
});