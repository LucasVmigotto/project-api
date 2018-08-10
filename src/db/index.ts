import * as knex from 'knex'
import * as config from '../knexfile'

export const connectDatabase = (options) => {
  const db = knex({
    ...config,
    ...options
  })
  const { logger } = options
  if (logger) {
    db.on('query', ({ sql, bindings }) => {
      logger.debug('query', { sql, bindings })
    })
  }
  return (req, res, next) => {
    req.db = db
    next()
  }
}
