const express = require('express');
const router = express.Router();
const Query = require("minecraft-query");
const mineQuery = new Query({ host: process.env.SERVER, port: process.env.QUERYPORT, timeout: 7500 });

router.get("/", (req, res) => {
    mineQuery.fullStat()
        .then(success => {
            res.json(success)
        })
        .catch(err => {
            res.json({ "error": true})
        })
})

module.exports = router;