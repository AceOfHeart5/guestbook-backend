const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('This is the backend for the guestbook app!');
});

app.get('/env', (req, res) => {
    res.send(process.env);
})

app.listen(port, () => {
  console.log(`Guestbook app listening at http://localhost:${port}`);
});
