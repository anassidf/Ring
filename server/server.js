const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./usersSchema');
const chalk = require('chalk');
const passport = require('passport');
const passportConfiguration = require('./passportConfiguration');
const cookie = require('cookie-session');

// configuration

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:3000',
	},
});
// database connection
mongoose
	.connect(
		'mongodb+srv://anas:anas123@authring.m88mf.mongodb.net/ring?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log(chalk.green('database connected successfully'));
	})
	.catch((err) => {
		console.log(err);
	});

//* start of middlewares
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

app.use(
	cookie({
		maxAge: 24 * 60 * 60 * 1000,
		keys: ['oahfoisnreogifnewd'],
	})
);
app.use(passport.initialize());

app.use(passport.session());

app.use(express.json());

//! end of middlewares

// routes
app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile'], session: true })
);

app.get(
	'/auth/callback',
	passport.authenticate('google', {
		successRedirect: 'http://localhost:3000/thanks',
	})
);
app.get('/isAuthenticated', (req, res) => {
	if (req.user) {
		res.json(req.user);
	} else {
		res.json({ message: 'cant fetch users info' });
	}
});
app.get('/logout', (req, res) => {
	req.logOut();
	res.send('logged out');
});

app.get('/allUsers', (req, res) => {
	User.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			console.log(err);
		});
});

//socket.io

io.on('connection', (socket) => {
	// docs
	console.log('server connected');

	socket.on('send-documentID', async (documentID) => {
		socket.join(documentID);
		let defaultValue = '';
		socket.emit('documentID-back', defaultValue);

		socket.on('send-delta', (delta) => {
			socket.broadcast.to(documentID).emit('changes', delta);
		});
	});

	socket.on('message', (msg) => {
		io.emit('text', msg);
	});

	socket.on('disconnect', () => {
		console.log('disconnect socket.io');
	});
});

// listening

http.listen(4000, () => {
	console.log(chalk.red.bold('connected successfully on port 4000'));
});
