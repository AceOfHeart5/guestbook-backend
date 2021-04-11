require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('connected to postgres'))
    .catch(err => {
        console.log('postgres connection failed');
        console.log(err)
    });

const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('This is the guestbook app backend.');
});

app.get('/env', (req, res) => {
    console.log(process.env);
    res.send('environment values logged to console');
});

app.get('/getmessages', (req, res) => {
    console.log('prepare to query');
    client.query(`SELECT * FROM public.entries;`)
        .then(data => res.send(data.rows))
        .catch(err => res.send(err));
});

app.post('/addmessage', (req, res) => {
    client.query(`INSERT INTO public.entries(entry) VALUES($1);`, [req.body.entry])
        .then(data => res.send(data))
        .catch(err => res.send(err));
});

app.listen(port, () => {
    console.log(`Guestbook app listening at http://localhost:${port}`);
});
