const Session = require("../models/Session");

async function checkLoggedUsers(username) {
	const allLoggedInUsers = await Session.find({});
	const isLoggedIn = () => {
		let loggedIn = false;
		allLoggedInUsers.forEach(async function(user) {
			const jsonOfSession = JSON.parse(user.session);
			if (jsonOfSession.username == username) {
				await Session.remove(user);
			}
		});
		return loggedIn;
	};

	return isLoggedIn();
}
module.exports.checkLoggedUsers = checkLoggedUsers;
