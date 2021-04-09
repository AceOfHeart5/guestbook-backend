require('dotenv').config();
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
client.connect()
    .then(() => console.log('connected to postgres'))
    .catch(err => {
        console.log('postgres connection failed');
        console.log(err)
    })
    .finally(() => client.end());

const dbSchema = process.env.DB_SCHEMA;
const dbTable = process.env.DB_TABLE;
const dbColumn = process.env.DB_COLUMN;
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
    client.query(`SELECT * FROM ${dbSchema}.${dbTable}`)
        .then(data => res.send(data))
        .catch(err => res.send(err));
});

app.post('/addmessage', (req, res) => {
    client.query(`INSERT INTO ${dbTable}(${dbColumn}) VALUES(?);`, [req.body.entry])
        .then(data => res.send(data))
        .catch(err => res.send(err));
});

app.listen(port, () => {
    console.log(`Guestbook app listening at http://localhost:${port}`);
});
