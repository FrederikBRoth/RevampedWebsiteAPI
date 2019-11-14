const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//Routes
const qnaRoute = require("./routes/qna");

//DB Connect
mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to DB");
	}
);
//Middleware
app.use(express.json());
//Route Middleware
app.use("/qna", qnaRoute);

app.get("/", (req, res) => {
	res.send("test123");
});

app.listen(3000);
