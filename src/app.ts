import * as express from 'express'
import * as bodyParser from 'body-parser'

import constants from '../config/constants'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

if(process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

app.listen(constants.PORT, (err) => {
  if(err) {
    throw err
  }

  console.log(`Server running on port ${constants.PORT}`)
  console.log(`Environment ${process.env.NODE_ENV}`)
})
