const { Client } = require('pg')

const PASS = process.env.POSTGRES_PASSWORD

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: `${PASS}`,
    port: 5432,
  })

async function connectDatabase() {
    await client.connect()
}
connectDatabase()

export default client