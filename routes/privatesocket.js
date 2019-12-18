const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Session = require("../models/Session");
const io = require("../app");

io.of("/privatesocket").on("connection", async socket => {
	console.log("Private chat user connected!");
	socket.on("disconnect", async () => {
		console.log("Private chat user disconnected!");
	});
	socket.on("create or join", () => {
		socket.emit("test");
	});
});
module.exports = router;
