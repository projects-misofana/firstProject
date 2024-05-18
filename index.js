const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const mongoose = require("mongoose")
const {db, port, dev_url} = require("./configs/vars")
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

    app.get("/room", (req, res) => {
        res.sendFile(join(__dirname, "/room/room.html"))
    })


    server.listen(port, () => {
        console.log(`Listening ${dev_url}${port}`)
    })

}).catch(() => {
    console.log("Disconnected")
})

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        const {username, message} = data;
        const user = {
            username: username,
            message: message
        }
        io.emit('chat message', user);
    });

    socket.on("token", (token) => {
        const user1 = jwtDecode.jwtDecode(token)
        console.log(user1)
        !users.some((user) => user.username === user1.username) &&
        users.push({
            username: user1.username,
            socketId: socket.id,
            token: token,
            friends: user1.friends
        })

        io.emit("users", users)
    })
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        io.emit("users", users)
    });
});