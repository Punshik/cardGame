const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/atlas.json", function(req, res) {
    res.sendFile(`${__dirname}/images/atlas.json`);
});

app.get("/atlas.png", function(req, res) {
    res.sendFile(`${__dirname}/images/atlas.png`);
});

app.get("/card_back.png", function(req, res) {
    res.sendFile(`${__dirname}/images/card_back.png`);
});

app.get("/button.png", function(req, res) {
    res.sendFile(`${__dirname}/images/button.png`);
});

app.get("/button2.png", function(req, res) {
    res.sendFile(`${__dirname}/images/button2.png`);
});

app.listen(3333, () => {
    console.log('Application listening on port 3333!');
    console.log(__dirname)
});