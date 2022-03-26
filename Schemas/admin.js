const { model, Schema } = require("mongoose");

module.exports = model("admin", new Schema({
    user: String,
    password: String,
    token: String
}));