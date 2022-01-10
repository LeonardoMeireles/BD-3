import { url } from "inspector"

const { Client } = require('pg')

const USER = process.env.POSTGRES_USER
const PASS = process.env.POSTGRES_PASSWORD
const DB = process.env.POSTGRES_DATABASE
const URL = process.env.POSTGRES_URL
const PORT = process.env.POSTGRES_PORT

var client : any
if (process.env.DATABASE_URL) {
  const URI = process.env.DATABASE_URL

  client = new Client({
    URI,
  })
} else {
  client = new Client({
    user: `${USER}`,
    host: `${URL}`,
    database: `${DB}`,
    password: `${PASS}`,
    port: `${PORT}`,
  })
}

async function connectDatabase() {
    await client.connect()
}
connectDatabase()

export default client