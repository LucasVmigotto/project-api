import './dotenv'
import * as express from 'express'
import * as cors from 'cors'
import * as graphqlHttp from 'express-graphql'
import { logger, expressLogger, expressErrorLogger } from './logger'
import { connectDatabase } from './db'
import { schema } from './graphql/Schema'

const app = express()

app.use(cors())

app.use(connectDatabase({ logger }))

app.use(expressLogger)

app.use(
  '/graphql',
  (req: any, res, next) => {
    req.logger = logger
    next()
  },
  graphqlHttp({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    formatError (err) {
      logger.error('GraphQL', err.stack)
      return err
    }
  })
)

app.use(expressErrorLogger)

app.use((err, req, res, next) => {
  res.send({ errors: [
    { message: err.message }
  ]})
})

export default app
