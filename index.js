const { checkProfanity } = require('./profanity');
console.log(checkProfanity);
const cors = require('cors');
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
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('This is the guestbook app backend.');
});

app.get('/env', (req, res) => {
    console.log(process.env);
    res.send('environment values logged to console');
});

app.get('/getmessages', (req, res) => {
    client.query(`SELECT * FROM public.entries;`)
        .then(data => res.send(data.rows))
        .catch(err => res.send(err));
});

const profanity = process.env.PROFANITY.split(' ');
app.post('/addmessage', (req, res) => {
    const response = { success: true, data: null, error: null };
    let hasProfanity = checkProfanity(profanity, req.body.entry);
    if (hasProfanity) {
        response.success = false;
        response.error = 'contains profanity';
        res.send(response);
        return;
    }
    client.query(`INSERT INTO public.entries(entry) VALUES($1);`, [req.body.entry])
        .then(data => {
            response.data = data;
            res.send(response);
        })
        .catch(err => {
            response.success = false;
            response.error = err;
            res.send(response);
        });
});

app.listen(port, () => {
    console.log(`Guestbook app listening at http://localhost:${port}`);
});
