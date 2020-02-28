/* eslint-disable
jsx-a11y/click-events-have-key-events,
jsx-a11y/no-static-element-interactions,
jsx-a11y/anchor-is-valid,
no-shadow,
react/prop-types
*/
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setAuthenticate from '../../store/actions/authenticateAction';
import { updateNavbar } from '../../store/actions/navbar/navbarActions';
import clearStats from '../../store/actions/profile/profileStatsActions';

/**
 * Logout
 * @param history
 * @param setAuthState
 * @param updateNavbar
 * @returns {*}
 * @constructor
 */
export const Logout = ({ history, setAuthState, updateNavbar, clearStats }) => (
	<button
		type='button'
		className='dropdown-item'
		href='/home'
		onClick={() => {
			setAuthState(false);
			updateNavbar();
			clearStats();
			history.push('/home');
		}}
	>
		Logout
	</button>
);

Logout.defaultProps = {
	setAuthState: null,
	updateNavbar: null,
	history: null,
};

Logout.propTypes = {
	setAuthState: PropTypes.func,
	history: PropTypes.shape({
		push: PropTypes.func,
	}),
	updateNavbar: PropTypes.func,
};

export default withRouter(
	connect(null, {
		setAuthState: setAuthenticate,
		updateNavbar,
		clearStats,
	})(Logout),
);
