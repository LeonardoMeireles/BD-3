import { url } from "inspector"

const { Client } = require('pg')

const PASS = process.env.POSTGRES_PASSWORD
const URL = process.env.POSTGRES_URL


const client = new Client({
    user: 'postgres',
    host: `${URL}`,
    database: 'postgres',
    password: `${PASS}`,
    port: 5432,
  })

async function connectDatabase() {
    await client.connect()
}
connectDatabase()

export default client