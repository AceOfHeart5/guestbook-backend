require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect()
    .then(() => console.log('connected to postgres'))
    .catch(err => console.log(err));

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
    res.send(process.env);
});

app.get('/getmessages', (req, res) => {
    db.any(`SELECT * FROM ${dbSchema}.${dbTable};`)
        .then(rows => {
            res.send(rows);
        })
        .catch(err => {
            res.send(err);
        });
});

app.post('/addmessage', (req, res) => {
    db.none(`INSERT INTO ${dbTable}(${dbColumn}) VALUES(?)`, [req.body.entry])
        .then(() => {
            res.send(`added message: ${req.body.entry}`);
        })
        .catch(err => {
            res.send(err);
        });
});

app.listen(port, () => {
    console.log(`Guestbook app listening at http://localhost:${port}`);
});
