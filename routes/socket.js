const express = require("express");
const router = express.Router();
const Message = require("../models/Message")
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(router);
const io = socketIo(server);
const session = require("../app")
const sharedsession = require("express-socket.io-session");

io.of("/socket").use(sharedsession(session, {
    autoSave: true
}))

io.of("/socket").on("connection", async socket => {
    console.log("Client connected!");
    socket.join("website chat");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        socket.leave("website chat")
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
server.listen("3001", () => console.log("Listen for socket connections"))

router.get("/messages", async (req, res) => {
    const messages = await Message.find({}).sort({ date: 1 });
    const newMessages = messages.slice(-15);
    const reactMessage = newMessages.map((message) => {
        return { text: message.text, sender: message.sender }
    })
    res.send(reactMessage)
})
module.exports = router