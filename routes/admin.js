const express = require('express');
const router = express.Router();
const DB = require("../Schemas/admin")
const bcrypt = require('bcryptjs');
const aesjs = require('aes-js')
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { user, password } = req.body;
        if (!(user && password)) {
            return res.status(400).json({ message: "Data missing" });
        }

        const oldAdmin = DB.findOne({ user });
        if (oldAdmin.user === user) return res.status(409).send("User already exists");

        const key = process.env.AES_KEY.split(', ').map(function(item) {
            return parseInt(item, 10);
        });
        const encryptedBytes = aesjs.utils.hex.toBytes(password);
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedPassword = aesjs.utils.utf8.fromBytes(decryptedBytes);

        const hashPassword = await bcrypt.hash(decryptedPassword, 10); 
        const admin = await DB.create({ user, password: hashPassword });
        const username = admin.user;
        const token = jwt.sign(
            { admin_id: admin._id, username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        admin.token = token;
        res.status(201).json(admin);
    } catch (err) {
        console.log(err)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { user, password } = req.body;
        if (!(user && password)) {
            return res.status(400).json({ message: "Data missing" });
        }
        const admin = await DB.findOne({ user })
        const username = admin.user;

        const key = process.env.AES_KEY.split(', ').map(function(item) {
            return parseInt(item, 10);
        });
        const encryptedBytes = aesjs.utils.hex.toBytes(password);
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedPassword = aesjs.utils.utf8.fromBytes(decryptedBytes);

        if (admin && (await bcrypt.compare(decryptedPassword, admin.password))) {
            const token = jwt.sign(
                { admin_id: admin._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            admin.token = token;
            res.status(200).json(admin);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;