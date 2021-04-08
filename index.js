require('dotenv').config();
const { config } = require('dotenv');
const express = require('express');
const app = express();
const port = process.env.PORT || process.env.PORT_DEV;

app.get('/', (req, res) => {
  res.sendStatus('This is the backend for the guestbook app.');
});

app.get('/env', (req, res) => {
    res.send(process.env);
})

app.listen(port, () => {
  console.log(`Guestbook app listening at http://localhost:${port}`);
});
