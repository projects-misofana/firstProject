const userrouter = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {join} = require("node:path")

const User = require("../models/user_model")
const {secret_kay} = require("../../configs/vars")
const authValidator = require("../../validators/authValidator")

userrouter.post("/login", async (req, res) => {
    const {username, password} = req.body
    let newUser;
    try {
        if (!username || !password)
            return res.status(400).json({error: "Fill the inputs"})

        const user = await User.findOne({username: username})
        if (!user) {
            console.log("Created")
            newUser = new User({
                username: username,
                password: await bcrypt.hash(password, 10)
            })
            await newUser.save()
            const token = await jwt.sign({_id: newUser._id, username: newUser.username}, secret_kay)
            newUser.token = token
            await newUser.save()
            return res.status(200).json({user: newUser, token: token})
        }
        const compare = await bcrypt.compare(password, user.password)
        if (!compare)
            return res.status(401).json({error: "Huiovo"})
        const token = await jwt.sign({_id: user._id, username: user.username}, secret_kay)
        user.token = token
        await user.save()
        return res.status(200).json({user: user, token: token})
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
})

userrouter.post("/friend", authValidator, async (req, res) => {
    const {userId} = req.body
    try {
        const friend = await User.findById(userId)
        const user = req.user

        if (!friend)
            return res.status(404).json({error: "Friend not found"})

        const isRequest = user.friends.some(friend1 => friend1.user.equals(friend._id))
        if (isRequest) {
            console.log("HAHA")
        } else {
            console.log('HIHI')
        }
        return res.status(200).json({message: "Request sent"})
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
})

module.exports = userrouter