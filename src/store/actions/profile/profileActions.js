import ACTION_TYPES from './profileTypes';
import {
	getUserProfile,
	getUsers,
	updateUserProfile,
} from '../../../lib/services/user.service';
import { nullToStr } from '../../../lib/helpers';
import {
	isEmail,
	isNotEmpty,
	isPhoneNumber,
	isValidDate,
	isValidId,
	isValidName,
} from '../../../utils/validations';
import actionFunc from '../../../utils/actionFunc';
import { BUTTON_LOADING, LOADING } from '../types';
import Toast from '../../../lib/toast';

/**
 * Fetch user profile and dispatch action on success
 * @param userId
 * @param creatingRequest
 * @returns {function(...[*]=)}
 */
const fetchUserProfile = (
	userId,
	creatingRequest = false,
) => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	const profileData = await getUserProfile(userId);
	let profile = profileData.data.data;

	const managersData = await getUsers('manager');
	const managers = managersData.data.data;

	dispatch(
		actionFunc(ACTION_TYPES.GET_USER_PROFILE_SUCCESS, {
			profile: nullToStr({
				...(!profile.remember && creatingRequest
					? (profile = {
							lineManager:
								profile.lineManager === 'none' ? 0 : profile.lineManager,
							email: profile.email,
							remember: profile.remember,
							profilePicture: profile.profilePicture,
					  })
					: profile),
				birthDate: profile.birthDate && profile.birthDate.split('T')[0],
				profilePicture: profile.profilePicture,
			}),
			managers,
			userId,
		}),
	);

	dispatch(actionFunc(LOADING, false));
};

/**
 * Clean profile changes and return previous state
 * @returns {function(...[*]=)}
 */
const revertChanges = () => async dispatch => {
	dispatch(actionFunc(ACTION_TYPES.REVERT_CHANGES, false));
};

/**
 * Set profile edit mode
 * @param {Boolean} value
 * @returns {function(...[*]=)}
 */
const setIsEditing = value => async dispatch => {
	dispatch(actionFunc(ACTION_TYPES.SET_EDIT_MODE, value));
};

const clearErrors = () => async dispatch => {
	dispatch(actionFunc(ACTION_TYPES.CLEAR_ERRORS));
};

/**
 * stores temporary user changes in application store
 * @param input
 * @returns {function(...[*]=)}
 */
const updateProfile = input => async dispatch => {
	const schema = {
		firstName: {
			validate: isValidName,
			errorMessage: 'First Name is not valid',
		},
		lastName: {
			validate: isValidName,
			errorMessage: 'Last Name is not valid',
		},
		email: {
			validate: isEmail,
			errorMessage: 'Email is not valid',
		},
		birthDate: {
			validate: isValidDate,
			errorMessage: 'Allowed date must be less than 2010',
		},
		department: {
			validate: isNotEmpty,
			errorMessage: 'Department can not be empty',
		},
		gender: {
			validate: isNotEmpty,
			errorMessage: 'Gender can not be empty',
		},
		phoneNumber: {
			validate: isPhoneNumber,
			errorMessage: 'Invalid phone number',
		},
		residenceAddress: {
			validate: isNotEmpty,
			errorMessage: 'Residence Address can not be empty',
		},
		preferredCurrency: {
			validate: isNotEmpty,
			errorMessage: 'Preferred Currency can not be empty',
		},
		preferredLanguage: {
			validate: isNotEmpty,
			errorMessage: 'Preferred language can not be empty',
		},
		lineManager: {
			validate: isValidId,
			errorMessage: 'Line Manager must be a number',
		},
		rememberInfo: {
			validate: () => true,
			errorMessage: '',
		},
		profilePicture: {
			validate: () => true,
			errorMessage: '',
		},
	};
	const name = Object.keys(input)[0];
	let errorMessage = null;
	const error = {};
	if (!schema[name].validate(input[name])) {
		errorMessage = schema[name].errorMessage;
	}

	input[name] =
		typeof input[name] !== 'string' ? input[name] : input[name].trim();

	const errorKey = `${name}Error`;
	error[errorKey] = errorMessage;
	dispatch(actionFunc(ACTION_TYPES.UPDATE_PROFILE, { input, error }));
	dispatch(actionFunc(ACTION_TYPES.SET_EDIT_MODE, true));
};

export const transformProfile = (userProfile, dispatch) => {
	userProfile.lineManagerId =
		userProfile.lineManager.id || userProfile.lineManager;
	userProfile.remember =
		userProfile.rememberInfo === undefined
			? userProfile.remember
			: userProfile.rememberInfo;

	delete userProfile.isVerified;
	delete userProfile.role;
	delete userProfile.lastLogin;
	delete userProfile.id;
	delete userProfile.createdAt;
	delete userProfile.updatedAt;
	delete userProfile.receiveNotification;

	const invalidLineManagerValues = [0, '0', 'none'];

	if (
		!userProfile.lineManagerId ||
		invalidLineManagerValues.includes(userProfile.lineManagerId)
	) {
		const error = {};
		error.lineManagerError = 'Please select a line manager';
		dispatch(actionFunc(ACTION_TYPES.UPDATE_PROFILE, { input: {}, error }));
		Toast('error', error.lineManagerError);
		dispatch(actionFunc(BUTTON_LOADING, false));
		dispatch(actionFunc(ACTION_TYPES.SET_EDIT_MODE, true));
		return false;
	}

	const notAllowed = ['', ' ', null, 'none', undefined];

	const filteredFields = Object.keys(userProfile).filter(
		key => !notAllowed.includes(userProfile[key]),
	);

	const validInformation = Object.assign(
		{},
		...filteredFields.map(key => ({ [key]: userProfile[key] })),
	);

	delete validInformation.lineManager;

	const { rememberInfo, ...profile } = validInformation;
	return profile;
};

/**
 * Update Profile and dispatch success action on success
 * @returns {function(...[*]=)}
 */
const saveProfile = userProfile => async dispatch => {
	const profile = transformProfile(userProfile, dispatch);
	const objectKeys = Object.keys(profile);
	const data = new FormData();

	objectKeys.forEach(key => {
		data.append(key, profile[key]);
	});
	dispatch(actionFunc(BUTTON_LOADING, true));
	dispatch(actionFunc(LOADING, true));

	if (!profile) {
		dispatch(actionFunc(BUTTON_LOADING, false));
		dispatch(actionFunc(LOADING, false));
		return false;
	}

	await updateUserProfile(data);
	const { userId } = JSON.parse(localStorage.getItem('bn_user_data'));
	const profileData = await getUserProfile(userId);
	const updatedProfile = profileData.data.data;
	dispatch(
		actionFunc(ACTION_TYPES.SAVE_PROFILE_SUCCESS, {
			updatedProfile: {
				...updatedProfile,
				birthDate:
					updatedProfile.birthDate && updatedProfile.birthDate.split('T')[0],
			},
			userId,
		}),
	);

	dispatch(actionFunc(ACTION_TYPES.SET_EDIT_MODE, false));
	dispatch(actionFunc(BUTTON_LOADING, false));
	dispatch(actionFunc(LOADING, true));
};

export {
	fetchUserProfile,
	setIsEditing,
	updateProfile,
	saveProfile,
	revertChanges,
	clearErrors,
};
