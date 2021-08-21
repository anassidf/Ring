const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const chalk = require('chalk');
const User = require('./usersSchema');

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	await User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			console.log(err);
		});
});
passport.use(
	new googleStrategy(
		{
			clientID:
				'841827120539-jfnqbcvqf5im52j93k6o2hoedq0vtj7m.apps.googleusercontent.com',
			clientSecret: '3A_dPHSy9NkfKL-7esviLcbv',
			callbackURL: '/auth/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ userID: profile.id })
				.then((user) => {
					if (user) {
						console.log(chalk.blue('this user is already exict'));

						done(null, user);
					} else {
						User.create({
							username: profile.displayName,
							userID: profile.id,
							picture: profile.photos[0].value,
						});
						done(null, user);
					}
				})
				.catch(() => {
					console.log(chalk.red('error in passport middleware'));
				});
		}
	)
);
