require('dotenv').config();
const mysqlConnection = require('mysql').createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
let dbConnected = true;
mysqlConnection.connect(err => {
    if (err) {
        console.log(err);
        dbConnected = false;
    }
});

const mysqlTable = process.env.MYSQL_TABLE;
const mysqlColumn = process.env.MYSQL_COLUMN;
const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('This is the guestbook app backend.');
});

app.get('/printenvs', (req, res) => {
    console.log(process.env);
    res.send('The environment variables have been logged to the console.');
});

app.get('/getmessages', (req, res) => {
    if (!dbConnected) {
        res.send('Sql db connection failed. Check environment variables.');
        return;
    }

    mysqlConnection.query(`SELECT * FROM ${mysqlTable};`, (err, rows, fields) => {
        res.send(rows);
    });
})

app.post('/addmessage', (req, res) => {
    if (!dbConnected) {
        res.send('Sql db connection failed. Check environment variables.');
        return;
    }

    mysqlConnection.query(`INSERT INTO ${mysqlTable}(${mysqlColumn}) VALUES(?)`, 
        [req.body.entry],
        function(err, result) {
            if (err === null) res.send(`added message: ${req.body.entry}`);
            else res.send(err);
        }
    );
});

app.listen(port, () => {
    console.log(`Guestbook app listening at http://localhost:${port}`);
});
