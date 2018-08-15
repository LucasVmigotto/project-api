import * as knex from 'knex'
import * as config from '../knexfile'

export const connectDatabase = (options) => {
  const db = knex({
    ...config,
    ...options
  })
  // const { logger } = options
  if (options.logger) {
    db.on('query', ({ sql, bindings }) => {
      options.logger.debug('query', { sql, bindings })
    })
  }
  return (req, res, next) => {
    req.db = db
    next()
  }
}
