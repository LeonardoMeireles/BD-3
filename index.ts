import express from 'express'
import homeRoutes from './routers/homeRouters'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 8000

// Sets EJS as view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(homeRoutes)

app.listen(PORT, () =>
    console.log(
        `⚡️ [server]: Server is running at https://localhost:${PORT}`
    )
);
