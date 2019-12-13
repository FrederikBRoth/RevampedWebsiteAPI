const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const sharedsession = require("express-socket.io-session");

session({
	secret: "federicowebsite",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
})


dotenv.config();

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
app.use(session);

io.of("/socket").use(sharedsession(session, {
	autoSave: true
}))

module.exports = io;

//Routes
const qnaRoute = require("./routes/qna");
const loginRoute = require("./routes/login");
const socketRoute = require("./routes/socket");

//Route Middleware
app.use("/api/socket", socketRoute);
app.use("/api/qna", qnaRoute);
app.use("/api/account", loginRoute);
app.get("/api", (req, res) => {
	res.send(req.session);
});
server.listen("3001", () => console.log("Listen for socket connections"))
app.listen(3000);

