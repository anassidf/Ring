import React, { useEffect, useState } from 'react';

import './discover.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ClearIcon from '@material-ui/icons/Clear';

import video from '../assets/video.svg';
import chat from '../assets/chat.svg';
import { io } from 'socket.io-client';
import { useForm } from 'react-hook-form';
import document from '../assets/docs.svg';

const Discover = () => {
	const [socket, setSocket] = useState(io);
	const [searchType, setSearchType] = useState('');
	const [authenicated, setAuthenticated] = useState(false);
	let [message, setMessage] = useState('');

	const [auth_user, setUser] = useState({});
	const [allUsers, setAllUsers] = useState([]);
	const { register, handleSubmit } = useForm();

	const history = useHistory();

	useEffect(() => {
		let s = io('http://localhost:4000');
		setSocket(s);
		console.log(socket);
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			await axios
				.get('http://localhost:4000/allUsers', { withCredentials: true })
				.then((users) => {
					if (allUsers) {
						setAllUsers(users.data);

						console.log(allUsers);
					}
				})
				.catch((err) => {
					console.log(err);
				});

			await axios
				.get('http://localhost:4000/isAuthenticated', {
					withCredentials: true,
				})
				.then((user) => {
					console.log(user.data);
					setUser(user.data);
					if (user.data.message) {
						setAuthenticated(false);
					} else {
						setAuthenticated(true);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		socket.on('text', (msg) => {
			let m = document.createElement('h5');
			m.style.backgroundColor = '#4668E0';
			m.style.borderRadius = '10px';
			m.style.padding = '10px';
			m.style.marginBottom = '40px';
			m.style.minWidth = '300px !important';

			let div = document.getElementsByClassName('messageFeild');
			div[0].append(m);
		});
	}, [socket]);

	const startChat = () => {
		// this part not working
		document.getElementById('chat').style.right = '0';
	};

	const closeChat = () => {
		document.getElementById('chat').style.right = '-100%';
	};

	const isntFunction = () => {
		alert('this feature isnt done yet >_<');
	};

	const submitChat = (info) => {
		setMessage(info.message);

		socket.emit('message', message);

		let input = document.getElementsByClassName('inputMessage');
		input[0].value = '';
	};

	return (
		<div className='discoverContainer'>
			{authenicated ? (
				<>
					<Navbar user={auth_user} />
					<div className='discoverBodyContainer'>
						<input
							type='text'
							placeholder='Search...'
							className='search'
							onChange={(e) => {
								setSearchType(e.target.value);
							}}
						/>
						<div className='usersContainer'>
							{allUsers
								.filter((element) => {
									if (searchType == '') return element;
									else if (
										element.username
											.toLowerCase()
											.includes(searchType.toLowerCase())
									) {
										return element;
									}
								})
								.map((element, index) => {
									return (
										<div className='userRow' key={index}>
											<img src={element.picture} className='usersImage' />
											<p className='usersName'>{element.username}</p>
											<div className='callType'>
												<img
													src={video}
													className='videoCall'
													onClick={isntFunction}
												/>
												<img
													src={chat}
													className='chatLogo'
													onClick={startChat}
												/>
											</div>
										</div>
									);
								})}
						</div>
						<div className='features'>
							<div className='globalChat feature'>
								<img
									src={chat}
									className='chatLogoGlobal'
									onClick={isntFunction}
								/>
							</div>
							<div className='docs feature'>
								<img
									src={document}
									className='chatLogoGlobal'
									onClick={() => {
										history.push('/documents');
									}}
								/>
							</div>
						</div>
					</div>

					{/* chat box  */}
				</>
			) : (
				<div className='notAuthenticated'>
					<div>you are not authenticated please go back</div>
				</div>
			)}

			<div id='chat' className='chattig'>
				<ClearIcon className='close' onClick={closeChat} />
				<div className='messageFeild'></div>
				<div className='chatForm'>
					<form onSubmit={handleSubmit(submitChat)}>
						<input
							{...register('message')}
							className='inputMessage'
							type='text'
							placeholder='Enter Youre Message'
						/>
						<button className='sendMessageButton'>Send</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Discover;
