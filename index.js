const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/env', (req, res) => {
    res.send(process.env);
})

app.listen(port, () => {
  console.log(`Guestbook app listening at http://localhost:${port}`);
});
