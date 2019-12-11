const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	expires: {
		type: Date,
		required: true
	},
	session: {
		type: String,
		requied: true
	}
});

module.exports = mongoose.model("Session", sessionSchema);
