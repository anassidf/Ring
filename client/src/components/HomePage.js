import React, { useEffect, useState } from 'react';
import './home.css';
import google from '../assets/google.svg';

import { useHistory } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
	const history = useHistory();
	const registration = () => {
		const registrationWindow = window.open('http://localhost:4000/auth/google');
		if (registrationWindow) {
			const interval = setInterval(() => {
				if (registrationWindow.closed) {
					history.push('/discover');
					clearInterval(interval);
				}
			}, 500);
		}
	};
	useEffect(() => {
		axios('http://localhost:4000/isAuthenticated', {
			withCredentials: true,
		}).then((user) => {
			console.log(user.data);

			if (!user.data.message) {
				history.push('/discover');
			}
		});
	}, []);

	return (
		<div className='homePage'>
			<div className='layout'>
				<h1>Welcome to Ring</h1>
				<div className='loginContainer'>
					<div className=' centerItems'>
						<button className='google py-2 px-5' onClick={registration}>
							<img src={google} alt='google logo' />
							Sign Up With Google
						</button>

						<h5>What you are Waiting for Join Us</h5>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
