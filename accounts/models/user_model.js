const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    token: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User