require("dotenv").config()

const db = process.env.DATABASE
const port = process.env.PORT
const secret_kay = process.env.SECRET_KAY
const base_url = process.env.BASE_RUL

module.exports = {db, port, secret_kay, base_url}