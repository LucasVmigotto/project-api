import * as winston from 'winston'
import * as expressWinston from 'express-winston'

const production = process.env.NODE_ENV === 'production'
export const logger = winston

const prod = process.env.NODE_ENV === 'production'
const timestamp = prod
const json = prod
const stringfy = prod
const colorize = !prod
const prettyPrint = !prod
const transport = new winston.transports.Console({
  timestamp,
  json,
  stringfy,
  colorize,
  prettyPrint
})
const transports = process.env.NODE_ENV === 'test'
  ? []
  : [ transport ]

logger.configure({
  level: process.env.LOG_LEVEL || 'info',
  transports
})

export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  requestWhitelist: [ ...expressWinston.requestWhitelist, 'id' ]
})

export const expressErrorLogger = expressWinston.errorLogger({
  winstonInstance: logger
})
