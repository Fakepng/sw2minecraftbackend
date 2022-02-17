require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5050;
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const Query = require("minecraft-query");
const mineQuery = new Query({ host: process.env.SERVER, port: process.env.QUERYPORT, timeout: 7500 });

app.get("/minecraft", (req, res) => {
    mineQuery.fullStat()
        .then(success => {
            res.json(success)
        })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});