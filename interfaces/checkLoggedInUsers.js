const Session = require("../models/Session");

async function checkLoggedUsers(username) {
	const allLoggedInUsers = await Session.find({});
	const isLoggedIn = () => {
		let loggedIn = false;
		allLoggedInUsers.forEach(function(user) {
			const jsonOfSession = JSON.parse(user.session);
			if (jsonOfSession.username == username) {
				loggedIn = true;
			}
		});
		return loggedIn;
	};

	return isLoggedIn();
}
module.exports.checkLoggedUsers = checkLoggedUsers;
