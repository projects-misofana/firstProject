const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const mongoose = require("mongoose")
const {db, port} = require("./configs/vars")
const {join} = require("node:path")
const http = require("http");
const {Server} = require("socket.io")
const jwtDecode = require("jwt-decode")


const router = require("./accounts/routes/userrouter")
const {json} = require("express");

let users = []

const app = express()
app.use(cors("*"))
const server = http.createServer(app)
const io = new Server(server)


mongoose.connect(db).then(() => {
    console.log("Connected")
    app.use(logger("dev"))
    app.use(json())
    app.use("/", router)
    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "/login/login.html"))
    })

    app.get("/zalupa", (req, res) => {
        res.sendFile(join(__dirname, "/game/game_1.html"))
    })


    io.engine.on("connection_error", (err) => {
        console.log(err);
    });

    io.on('connection', (socket) => {
        socket.on('chat message', (data) => {
            const { username, message } = data;
            const user = {
                username: username,
                message: message
            }
            io.emit('chat message', user);
        });

        socket.on("token", (token) => {
            const username = jwtDecode.jwtDecode(token).username
            !users.some((user) => user.username === username) &&
            users.push({
                username: jwtDecode.jwtDecode(token).username,
                socketId: socket.id
            })
            console.log(users)

            io.emit("users", users)
        })
        socket.on('disconnect', () => {
            users = users.filter(user => user.socketId !== socket.id)
            io.emit("users", users)
        });
    });

    server.listen(port, () => {
        console.log(`Listening http://localhost:${port}`)
    })

}).catch(() => {
    console.log("Disconnected")
})