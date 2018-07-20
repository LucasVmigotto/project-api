import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

module.exports = {
  client: 'pg',
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    directory: './migrations'
  }
}
