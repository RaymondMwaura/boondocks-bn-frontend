/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavbarNav from './NavbarNav';
import { updateNavbar } from '../store/actions/navbar/navbarActions';

const Navbar = ({
	notifications,
	isAuthenticated,
	navItems,
	twoFAVerified,
	updateNavbar,
}) => {
	useEffect(() => {
		updateNavbar();
	}, [isAuthenticated, twoFAVerified]);
	return (
		<div id='nav' className='navigation-wrap bg-light start-header start-style'>
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						<NavbarNav
							notifications={isAuthenticated ? notifications : []}
							isAuthenticated={isAuthenticated}
							navItems={navItems}
							twoFAVerified={twoFAVerified}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	navItems: state.navbarState.navItems,
	twoFAVerified: state.navbarState.twoFAVerified,
	notifications: state.navbarState.notifications,
	isAuthenticated: state.authState.isAuthenticated,
});

Navbar.propTypes = {
	notifications: PropTypes.instanceOf(Array),
	isAuthenticated: PropTypes.bool.isRequired,
	navItems: PropTypes.instanceOf(Array).isRequired,
	twoFAVerified: PropTypes.bool,
	updateNavbar: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
	twoFAVerified: false,
};

Navbar.defaultProps = {
	notifications: [],
};

export default connect(mapStateToProps, {
	updateNavbar,
})(Navbar);
