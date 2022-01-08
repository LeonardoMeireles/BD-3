import express from 'express'
import homeRoutes from './routers/homeRouters'
import path from 'path'
const { Client } = require('pg')

const app = express()
const PORT = process.env.PORT || 8000;
const PASS = process.env.POSTGRES_PASSWORD

// Sets EJS as view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(homeRoutes)


async function main(){

    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'postgres',
        password: `${PASS}`,
        port: 5432,
      })
    await client.connect()

    app.listen(PORT, () =>
        console.log(
            `⚡️ [server]: Server is running at https://localhost:${PORT}`
        )
    );

}

main()
