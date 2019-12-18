const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Session = require("../models/Session");
const io = require("../app");
const namespace = "/privatesocket";

io.of(namespace).on("connection", async socket => {
	console.log("Private chat user connected!");
	socket.on("disconnect", async () => {
		console.log("Private chat user disconnected!");
	});
	socket.on("create or join", () => {
		console.log("Received request to create or join room " + room);

		var clientsInRoom = io.of(namespace).adapter.rooms[room];
		var numClients = clientsInRoom
			? Object.keys(clientsInRoom.sockets).length
			: 0;
		console.log("Room " + room + " now has " + numClients + " client(s)");

		if (numClients === 0) {
			socket.join(room);
			console.log("Client ID " + socket.id + " created room " + room);
			socket.emit("created", room, socket.id);
		} else if (numClients === 1) {
			console.log("Client ID " + socket.id + " joined room " + room);
			io.of(namespace)
				.to(room)
				.emit("join", room);
			socket.join(room);
			socket.emit("joined", room, socket.id);
			io.of(namespace)
				.to(room)
				.emit("ready");
		} else {
			// max two clients
			socket.emit("full", room);
		}
	});
	socket.on("message", (message, room) => {
		log("Client said: ", message);
		// for a real app, would be room-only (not broadcast)
		socket.to(room).emit("message", message);
	});
});
module.exports = router;
