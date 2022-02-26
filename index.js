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

app.get("/", (req, res) => {
    res.json({ message: "welecome to fakepng api backend", contact: "contact@fakepng.com"})
})

const minecraftRouter = require('./routes/minecraft');
app.use('/minecraft', minecraftRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});