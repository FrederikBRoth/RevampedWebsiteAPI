const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
	registerValidation,
	loginValidation
} = require("../interfaces/validate");

const { checkLoggedUsers } = require("../interfaces/checkLoggedInUsers");
const User = require("../models/User");

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) {
		res.statusMessage = error.details[0].message;
		return res.status(400).end();
	}

	const user = await User.findOne({ username: req.body.username });
	if (!user) {
		res.statusMessage = "User not in the system!";
		return res.status(400).end();
	}

	const AlreadyLoggedIn = await checkLoggedUsers(req.body.username);
	if (AlreadyLoggedIn) {
		res.statusMessage = "User already logged in!";
		return res.status(400).end();
	}

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		res.statusMessage = "Invalid password";
		return res.status(400).end();
	}

	req.session.username = req.body.username;
	req.session.loggedIn = true;

	res.send({ username: req.session.username, loggedIn: req.session.loggedIn });
});

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error) {
		res.statusMessage = error.details[0].message;
		return res.status(400).end();
	}
	const userExists = await User.findOne({ username: req.body.username });
	if (userExists) {
		res.statusMessage = "User already in the system!";
		return res.status(400).end();
	}

	//Hash password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashPassword
	});
	const savedUser = await newUser.save();
	res.send("User Created!");
});

router.get("/checklogin", async (req, res) => {
	console.log(req.session);
	res.send(req.session);
});

router.get("/logout", async (req, res) => {
	req.session.loggedIn = false;
	console.log(req.session);
	res.send("Logged Out!");
});
module.exports = router;
