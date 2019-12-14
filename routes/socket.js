const express = require("express");
const router = express.Router();
const Message = require("../models/Message")
const Session = require("../models/Session");
const io = require("../app");

io.of("/socket").on("connection", async socket => {
    console.log("Client connected!");
    socket.handshake.session.socketId = socket.id;
    socket.handshake.session.save();
    socket.join("website chat");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        socket.leave("website chat")
        delete socket.handshake.session.socketId
        socket.handshake.session.save();
    });
    socket.on("SendMessage", async (message, sender) => {
        console.log(message)
        socket.to("website chat").emit("ReceiveMessage", message, sender)
        socket.emit("ReceiveMessage", message, sender)
        const newMessage = new Message({
            text: message,
            sender: sender,
        })
        await newMessage.save();
    })
});


router.get("/messages", async (req, res) => {
    const messages = await Message.find({}).sort({ date: 1 });
    const newMessages = messages.slice(-15);
    const reactMessage = newMessages.map((message) => {
        return { text: message.text, sender: message.sender }
    })
    res.send(reactMessage)
})
router.get("/loggedinusers", async (req, res) => {
    const loggedInUsers = await Session.find({});
    const userSessions = loggedInUsers.map((user, key) => {
        return JSON.parse(user.session)
    })
    const userList = userSessions.filter((user) => {
        if (user.socketId) {
            return true
        } else {
            return false;
        }
    }).map((user) => {
        return { username: user.username, socketId: user.socketId };
    })
    res.send(userList);
})
module.exports = router