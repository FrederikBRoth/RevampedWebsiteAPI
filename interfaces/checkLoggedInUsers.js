const Session = require("../models/Session");

async function checkLoggedUsers(username) {
	let canLogIn = true;
	const allLoggedInUsers = await Session.find({}, function(err, users) {
		users.forEach(function(user) {
			const jsonOfSession = JSON.parse(user.session);
			if (jsonOfSession.username == username) {
				canLogIn = true;
			} else {
				canLogIn = false;
			}
		});
	});
	return canLogIn;
}
module.exports.checkLoggedUsers = checkLoggedUsers;
