/* eslint-disable max-len */
import { combineReducers } from 'redux';
import profile from './profileReducer';
import signupReducer from './authReducers';
import loadingReducer from './loadingReducer';
import resetPasswordReducer from './resetPasswordReducer';
import loginReducer from './loginReducer';
import isAuthenticatedReducer from './isAuthenticatedReducer';
import errorReducer from './errorHandlerReducer';
import requestPageLimitReducer from './requestPageLimitReducer';
import requestReducer from './requestReducer';
import singleRequestReducer from './singleRequestReducer';
import usersReducer from './usersReducer';
import navbarReducer from './navbarReducer';
import createHotelReducer from './createHotelReducer';
import getAccommodationReducers from './getAccomodationReducers';
import getSingleHotelReducer from './getSingleHotelReducer';
import createRoomsReducer from './createRoomsReducer';
// eslint-disable-next-line import/named
import requestSearchReducer, { isSearching } from './requestSearchReducer';
import listReducer from './listReducer';
import commentReducer from './commentReducer';
import createTripReducer from './createTripReducer';
import editRequestReducer from './editRequestReducer';
import deleteCommentReducer from './deleteCommentReducer';
import bookingReducer from './bookingReducer';
import notificationReducer from './notificationReducer';
import updateNotificationReducer from './updateNotificationReducer';
import tripStatsReducer from './tripStatsReducer';
import rateAccomodationReducer from './rateAccomodationReducer';
import markAsReadReducer from './markAsReadReducer';
import feedbackReducer from './feedbackReducer';
import paymentsReducer from './paymentsReducer';
import profileCardsReducer from './profileCardsReducer';
import documentsReducer from './documentsReducer';
import twoFactorAuthReducer from './twoFactorAuthReducer';

const reducers = combineReducers({
	signupState: signupReducer,
	resetState: resetPasswordReducer,
	forgotState: resetPasswordReducer,
	loadingState: loadingReducer,
	loginState: loginReducer,
	profileState: profile,
	singleRequestState: singleRequestReducer,
	authState: isAuthenticatedReducer,
	errorState: errorReducer,
	requestPageLimitState: requestPageLimitReducer,
	requestsState: requestReducer,
	usersState: usersReducer,
	navbarState: navbarReducer,
	createHotelState: createHotelReducer,
	createRoomState: createRoomsReducer,
	hotelState: getAccommodationReducers,
	singleHotelState: getSingleHotelReducer,
	requestSearchState: requestSearchReducer,
	isSearchingState: isSearching,
	listState: listReducer,
	commentState: commentReducer,
	createTripState: createTripReducer,
	updateTripState: editRequestReducer,
	deleteCommentState: deleteCommentReducer,
	bookingState: bookingReducer,
	notificationState: notificationReducer,
	markAsReadState: markAsReadReducer,
	updateNotificationState: updateNotificationReducer,
	tripStatState: tripStatsReducer,
	rateAccomodationState: rateAccomodationReducer,
	feedbackState: feedbackReducer,
	bookingPaymentState: paymentsReducer,
	profileCardsState: profileCardsReducer,
	documentsState: documentsReducer,
	twoFactorAuthState: twoFactorAuthReducer,
});

export default reducers;
