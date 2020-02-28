/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import { Link, useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NavLinkItem from './templates/NavLinkItem';
import UserAccount from './UserAccount';
import { setPath } from '../store/actions/navbar/navbarActions';

export const NavbarNav = ({
	navItems,
	isAuthenticated,
	notifications,
	setPath,
}) => {
	const hasUserData = !!localStorage.bn_user_data;
	useEffect(() => {}, [isAuthenticated]);

	const history = useHistory();

	useEffect(() => {
		setPath(history.location.pathname);
	}, [history.location.pathname]);
	return (
		<nav
			data-testid='navbar-nav'
			className='navbar navbar-expand-md navbar-light'
		>
			<Link className='navbar-brand' to='/'>
				<img
					src='https://bn-pictures.s3.eu-north-1.amazonaws.com/bn_logo.svg'
					alt='Barefoot logo'
				/>
			</Link>
			<button
				className='navbar-toggler'
				type='button'
				data-toggle='collapse'
				data-target='#navbarSupportedContent'
				aria-controls='navbarSupportedContent'
				aria-expanded='false'
				aria-label='Toggle navigation'
			>
				<span className='navbar-toggler-icon' />
			</button>
			<div className='collapse navbar-collapse' id='navbarSupportedContent'>
				<ul className='navbar-nav ml-auto py-4 py-md-0'>
					{navItems.map(({ linkText, linkRoute }, idx) => (
						<NavLinkItem key={idx} linkText={linkText} linkRoute={linkRoute} />
					))}
				</ul>
				{(isAuthenticated || hasUserData) && (
					<ul
						data-testid='other-links'
						className='navbar-nav ml-auto py-4 py-md-0'
					>
						{/* <NavLinkItem linkText='Public chat' icon='comments' /> */}
						<NavLinkItem
							linkText='&nbsp;'
							icon='bell-o bell-icon small-icon'
							haspopup
							notifications={notifications}
						/>
						<UserAccount />
					</ul>
				)}
			</div>
		</nav>
	);
};

export default connect(null, {
	setPath,
})(NavbarNav);
