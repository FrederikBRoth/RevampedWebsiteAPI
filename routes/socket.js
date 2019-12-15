const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Session = require("../models/Session");
const io = require("../app");

io.of("/socket").on("connection", async socket => {
	console.log("Client connected!");
	socket.handshake.session.socketId = socket.id;
	socket.handshake.session.save();
	socket.join("website chat");
	//Updates user list
	socket.emit("UpdateUsers");
	socket.to("website chat").emit("UpdateUsers");
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		delete socket.handshake.session.socketId;
		socket.handshake.session.tester = "fuck you";
		socket.handshake.session.save();
		//Updates user list
		socket.emit("UpdateUsers");
		socket.to("website chat").emit("UpdateUsers");
		socket.leave("website chat");
	});
	socket.on("SendMessage", async (message, sender) => {
		console.log(message);
		socket.to("website chat").emit("ReceiveMessage", message, sender);
		socket.emit("ReceiveMessage", message, sender);
		const newMessage = new Message({
			text: message,
			sender: sender
		});
		await newMessage.save();
	});
});
router.get("/messages", async (req, res) => {
	const messages = await Message.find({}).sort({ date: 1 });
	const newMessages = messages.slice(-15);
	const reactMessage = newMessages.map(message => {
		return { text: message.text, sender: message.sender };
	});
	res.send(reactMessage);
});
router.get("/loggedinusers", async (req, res) => {
	const loggedInUsers = await Session.find({});
	const userSessions = loggedInUsers.map((user, key) => {
		return JSON.parse(user.session);
	});
	const userList = userSessions
		.filter(user => {
			if (user.socketId) {
				return true;
			} else {
				return false;
			}
		})
		.map(user => {
			return { username: user.username, socketId: user.socketId };
		});
	res.send(userList);
});
router.post("/sendprivate", async (req, res) => {
	const socketId = req.body.socketId;
	console.log("Send private Request" + socketId);
	io.to(socketId).emit("Signal", { request: req.body.user });
});
module.exports = router;
