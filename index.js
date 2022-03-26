require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5050;
const CLIENT = process.env.CLIENT || '*';
const DATABASE = process.env.DATABASE;
const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', CLIENT);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "welecome to fakepng api backend", contact: "contact@fakepng.com" })
})

app.use('/minecraft', require('./routes/minecraft'));
app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Database 💽");
}).catch((err) => {
    console.log(err)
});