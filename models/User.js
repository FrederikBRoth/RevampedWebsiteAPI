const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 6
	},
	email: {
		type: String,
		required: true,
		minlength: 6
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	}
});

module.exports = mongoose.model("User", userSchema);
