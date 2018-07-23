import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

module.exports = {
  client: process.env.DB_CLIENT,
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    directory: './migrations'
  }
}
