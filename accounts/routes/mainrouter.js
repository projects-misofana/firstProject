const router = require('express').Router()
const userrouter = require("./userrouter")

router.use("/", userrouter)

module.exports = router