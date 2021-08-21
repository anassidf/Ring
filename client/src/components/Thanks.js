import React, { useEffect } from 'react';

const Thanks = () => {
	useEffect(() => {
		setTimeout(() => {
			window.close();
		}, 1000);
	}, []);
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}>
			<h1 style={{ color: 'black' }}>Thanks for Using Ring</h1>
		</div>
	);
};

export default Thanks;
