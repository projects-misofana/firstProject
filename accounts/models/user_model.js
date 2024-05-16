const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    token: String,
    friends: [{
        type: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            isConfirmed: Boolean,
            isSender: Boolean,
        }
    }],
    createAt: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User