import * as http from 'http'
import app from './app'
import { logger } from './logger'

const server = http.createServer(app)
const port = parseInt(process.env.PORT) || 3000

server.listen(port)
server.on('listening', () => {
  const addr = server.address()
  const bind = (typeof addr === 'string' )
    ? `pipe ${addr}`
    : `port ${addr.port}`
  logger.info(`Listening at ${bind}`)
})
