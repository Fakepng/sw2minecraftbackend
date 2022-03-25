const { model, Schema } = require("mongoose");

module.exports = model("testsw2data", new Schema({
    studentId: String,
    nameTH: String,
    nameEN: String,
    email: String,
    MOS: Boolean,
    classroom: String,
    tel: String,
    username: String,
    activity: String,
    date: { type: Date, default: Date.now },
}));