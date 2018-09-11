import * as express from 'express'

import constants from '../config/constants'
import { server } from '../src/modules/graphql'

const app = express()

if(process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}
const path = '/api/graphql'

server.applyMiddleware({app, path})

app.listen(constants.PORT, (err) => {
  if(err) {
    throw err
  }

  console.log(`Server running on port ${constants.PORT}`)
  console.log(`Environment ${process.env.NODE_ENV}`)
})
