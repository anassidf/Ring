const mongoose = require('mongoose');

const user = mongoose.Schema({
	username: { type: String },
	picture: { type: String },
	userID: { type: String },
});

module.exports = mongoose.model('User', user);
