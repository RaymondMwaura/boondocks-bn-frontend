import actionFunc from '../../../utils/actionFunc';
import NAVBAR_TYPES from './navbarTypes';
import ROLE_TYPES from '../roles/rolesTypes';
import {
	navItemObjects,
	notificationsItems,
} from '../../../components/NavbarData';

const updateNavbar = () => dispatch => {
	let navItems = [];
	const user = JSON.parse(localStorage.getItem('bn_user_data')) || {};
	const bnUser2FA = JSON.parse(localStorage.getItem('bn_user_2fa'));
	const twoFAVerified = bnUser2FA && bnUser2FA.twoFAVerified;

	if (ROLE_TYPES.includes(user.role)) {
		if (twoFAVerified === false) {
			navItems = [
				navItemObjects.un_authenticated[0],
				{
					linkText: 'Two Factor Authentication',
					linkRoute: '/login-2-fa',
				},
			];
		} else {
			navItems = [...navItemObjects.general, ...navItemObjects[user.role]];
		}
	} else {
		navItems = [...navItemObjects.un_authenticated];
	}

	dispatch(
		actionFunc(NAVBAR_TYPES.UPDATE_NAVBAR, {
			navItems,
			notificationsItems,
			twoFAVerified,
		}),
	);
};

const setPath = path => dispatch => {
	dispatch(actionFunc(NAVBAR_TYPES.NAVBAR_PATH_CHANGED, path));
};

export { updateNavbar, setPath };
