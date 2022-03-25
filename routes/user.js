const express = require('express');
const router = express.Router();
const DB = require("../Schemas/testsw2data")

router.get("/register", (req, res) => {
    res.json({
        studentId: "String",
        nameTH: "String",
        nameEN: "String",
        email: "String",
        MOS: "Boolean",
        classroom: "String",
        tel: "String",
        username: "String",
        activity: "String"
    })
})

router.post("/register", (req, res) => {
    try {
        const { studentId, nameTH, nameEN, email, MOS, classroom, tel, username, activity } = req.body;
        if (!(studentId && nameTH && nameEN && email && classroom && tel && username && activity )) {
            return res.status(400).json({ message: "Data missing" });
        }
        DB.create({ studentId, nameTH, nameEN, email, MOS, classroom, tel, username, activity })
        res.status(201).json({ message: `Register successfully` });
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.get("/query/:studentId", async (req, res) => {
    const user = await DB.find({ studentId: req.params.studentId })
    if (user.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(user);
})

module.exports = router;