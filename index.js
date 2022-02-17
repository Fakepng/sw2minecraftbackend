require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5050;
const app = express();
let cors = require("cors");

const Query = require("minecraft-query");
const mineQuery = new Query({host: process.env.SERVER, port: process.env.QUERYPORT, timeout: 7500});

app.get("/minecraft", cors(), (req, res) => {
    mineQuery.fullStat()
    .then(success => {
        res.json(success)
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});