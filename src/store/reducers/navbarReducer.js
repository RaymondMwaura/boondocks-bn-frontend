import NAVBAR_TYPES from '../actions/navbar/navbarTypes';

const initialState = {
	navItems: [],
	notifications: [],
	currentPath: '',
	twoFAVerified: false,
};

const navbarReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case NAVBAR_TYPES.UPDATE_NAVBAR:
			return {
				...state,
				navItems: payload.navItems,
				notifications: payload.notificationsItems,
				twoFAVerified: payload.twoFAVerified,
			};

		case NAVBAR_TYPES.NAVBAR_PATH_CHANGED:
			return {
				...state,
				currentPath: payload,
			};
		default:
			return state;
	}
};

export default navbarReducer;
