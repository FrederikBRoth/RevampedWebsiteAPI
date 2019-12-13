const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const socketIo = require("socket.io");

const MongoStore = require("connect-mongo")(session);

const Message = require("./models/Message")

dotenv.config();
//Routes
const qnaRoute = require("./routes/qna");
const loginRoute = require("./routes/login");

//DB Connect
mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to DB");
	}
);

//Middleware
app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: "federicowebsite",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	})
);

//Socket IO setup
const server = http.createServer(app);
const io = socketIo(server);
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
//Socket IO methods
io
//Route Middleware
app.use("/api/qna", qnaRoute);
app.use("/api/account", loginRoute);
app.get("/api", (req, res) => {
	res.send(req.session);
});


app.listen(3000);
