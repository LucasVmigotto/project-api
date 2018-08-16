import app from './app'
import { logger } from './logger'

const port = parseInt(process.env.PORT) || 3000

const server = app.listen(port, () => {
  logger.info(`Runnig API at *:${port}/graphql`)
})

server.once('close', () => app.emit('close'))

server.on('error', (err: any) => {
  logger.error(err)
  if (err.code === 'EADDRINUSE') {
    server.emit('close')
  }
})

process.once('SIGTERM', function () {
  server.close()
})
