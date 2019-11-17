const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
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
		saveUninitialized: true
	})
);

//Route Middleware
app.use("/api/qna", qnaRoute);
app.use("/api/account", loginRoute);
app.get("/api", (req, res) => {
	res.send(req.session);
});

app.listen(3000);
