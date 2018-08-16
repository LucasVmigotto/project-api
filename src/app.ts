import './dotenv'
import * as express from 'express'
import * as cors from 'cors'
import * as graphqlHttp from 'express-graphql'
import { logger, expressLogger, expressErrorLogger } from './logger'
import { connectDatabase } from './db'
import { schema } from './graphql/Schema'
import { tokenExpressResolver } from './security'

const app = express()
const conn = connectDatabase({ logger })

app.use(cors())

app.use(conn.handler)

app.use(expressLogger, (req: any, res, next) => {
  req.jwtOptions = {
    key: process.env.JWT_KEY || 'super secret key',
    exp: process.env.JWT_EXP || 60 * 60 * 24 * 7,
    expRemember: process.env.JWT_EXP_REMEMBER || 30 * 24 * 60 * 60
  },
  req.logger = logger
  next()
})

app.use(
  '/graphql',
  tokenExpressResolver,
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
    { message: err.message}
  ]})
})

app.once('close', function () {
  conn.db.destroy()
})

export default app
