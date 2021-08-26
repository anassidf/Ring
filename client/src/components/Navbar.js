import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Ring from '../assets/ring.svg';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
//! reuse for material ui icon

const StyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: '$ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}))(Badge);

const Navbar = ({ user }) => {
	const history = useHistory();

	const logout = () => {
		axios
			.get('http://localhost:4000/logout', { withCredentials: true })
			.then(() => {
				console.log('logout');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const showMenu = () => {
		let menu = document.getElementById('menuWindow');
		menu.style.display = 'flex';
		menu.style.right = '0';
	};
	const closeMenu = () => {
		let menu = document.getElementById('menuWindow');

		menu.style.right = '-100%';
		menu.style.display = 'none';
	};

	return (
		<div className='navbarContainer'>
			<div className='navbar'>
				<div>
					<img src={Ring} alt='website logo' className='ringLogo' />
				</div>

				<Link className='link' onClick={logout} to='/'>
					Logout
				</Link>

				<StyledBadge
					className='userAvatar'
					overlap='circular'
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					variant='dot'>
					<Avatar className='avatar' alt='user' src={user.picture} />
				</StyledBadge>
				<div className='link'>{user.username}</div>
				<MenuIcon className='menu' onClick={showMenu} />
				{/* menu */}
				<div id='menuWindow'>
					<Link className='linkMenu' onClick={logout} to='/'>
						Logout
					</Link>
					<div className='userMenu'>
						<Avatar className='avatarMenu' alt='user' src={user.picture} />
						<p className='linkMenu'>{user.username}</p>
					</div>
					<ClearIcon className='closeMenu' onClick={closeMenu} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
