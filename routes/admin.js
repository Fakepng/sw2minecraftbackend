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

router.put('/repass', async (req, res) => {
    try {
        const { user, password, newPassword } = req.body;
        if (!(user && password && newPassword)) {
            return res.status(400).json({ message: "Data missing" });
        }
        const admin = await DB.findOne({ user });
        if (!admin) return res.status(404).json({ message: "User not found" });

        const key = process.env.AES_KEY.split(', ').map(function(item) {
            return parseInt(item, 10);
        });
        const encryptedBytes = aesjs.utils.hex.toBytes(password);
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedPassword = aesjs.utils.utf8.fromBytes(decryptedBytes);
        if (admin && (await bcrypt.compare(decryptedPassword, admin.password))) {
            const newEncryptedBytes = aesjs.utils.hex.toBytes(newPassword);
            const newDecryptedBytes = aesCtr.decrypt(newEncryptedBytes);
            const newDecryptedNewPassword = aesjs.utils.utf8.fromBytes(newDecryptedBytes);
    
            const newHashPassword = await bcrypt.hash(newDecryptedNewPassword, 10); 
            await DB.updateOne({ user }, { $set: { password: newHashPassword } })
            res.status(200).json({ message: "Update successfully" });
        } else {
            res.status(401).json({ message: "Wrong password" });
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(500);
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