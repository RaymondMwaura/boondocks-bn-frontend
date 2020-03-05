/* eslint-disable max-len, no-shadow */
import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import NotFound from './views/NotFound';
import HomePage from './views/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/templates/Footer';
import ForgotPasswordPage from './views/ForgotPasswordPage';
import ResetPasswordPage from './views/ResetPasswordPage';
import SingleRequestPage from './views/SingleRequestPage';
import Loader from './components/templates/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import RequestPage from './views/RequestPage';
import EditProfileContainer from './components/EditProfileContainer';
import ViewProfileContainer from './components/ViewProfileContainer';
import UsersContainer from './components/UsersContainer';
import CreateAccommodationPage from './views/accomodations/CreateAccomodationPage';
import CreateRoomsPage from './views/accomodations/CreateRoomsPage';
import SingleHotelPage from './views/accomodations/SingleHotelPage';
import ChatView from './views/ChatView';
import BookingContainer from './components/BookingContainer';
import ViewBooking from './components/ViewBookingContainer';
import TravelStatsPage from './views/TravelStatsPage';
import CreateRequestView from './views/requests/CreateRequestView';
import { updateNavbar } from './store/actions/navbar/navbarActions';
import setAuthenticate from './store/actions/authenticateAction';
import { nowSeconds } from './lib/time';
import BookingPayment from './components/payments/BookingPayment';
import TravelDocuments from './components/TravelDocuments';
import LoginTwoFAPage from './views/LoginTwoFAPage';
import SettingsPage from './views/settings/SettingsPage';

/**
 * App component
 * @param isAuthenticated
 * @param setAuthenticate
 * @param updateNavbar
 * @returns {*}
 * @constructor
 */
export const App = ({ isAuthenticated, setAuthenticate, updateNavbar }) => {
	const { exp } = localStorage.getItem('bn_user_data')
		? JSON.parse(localStorage.getItem('bn_user_data'))
		: { exp: nowSeconds };
	const diffToExpiration = exp - nowSeconds;
	const positiveDifferenceOrZero = diffToExpiration > 0 ? diffToExpiration : 0;

	useEffect(() => {
		if (isAuthenticated) {
			setTimeout(() => {
				setAuthenticate(false);
				updateNavbar();
			}, positiveDifferenceOrZero * 1000);
		}
	}, [isAuthenticated]);

	return (
		<Router>
			<Loader />
			<Navbar />
			<div data-testid='app' className='App pt-5'>
				<Switch>
					<Route path='/home' exact component={HomePage} />
					<Route path='/register' exact component={RegisterPage} />
					<Route path='/login' exact component={LoginPage} />
					<ProtectedRoute
						path='/profile/:userId'
						component={ViewProfileContainer}
					/>
					<ProtectedRoute
						path='/bookings/payment'
						exact
						component={BookingPayment}
					/>
					<ProtectedRoute
						path='/profile'
						exact
						component={ViewProfileContainer}
					/>
					<ProtectedRoute
						path='/travel-stats'
						exact
						component={TravelStatsPage}
					/>
					<ProtectedRoute path='/edit' exact component={EditProfileContainer} />
					<ProtectedRoute
						path='/hotel/create'
						exact
						component={CreateAccommodationPage}
					/>
					<ProtectedRoute path='/hotel/:id' exact component={SingleHotelPage} />
					<ProtectedRoute
						path='/hotel/:id/room/create'
						exact
						component={CreateRoomsPage}
					/>
					<ProtectedRoute
						path='/booking/:hotelId'
						exact
						component={BookingContainer}
						title='Booking'
					/>
					<ProtectedRoute
						path='/request/:requestId'
						exact
						component={SingleRequestPage}
					/>
					<Route
						path='/auth/forgot-password'
						component={ForgotPasswordPage}
						exact
					/>
					<Route
						path='/auth/reset-password'
						exact
						component={ResetPasswordPage}
					/>
					<ProtectedRoute path='/users' exact component={UsersContainer} />
					<ProtectedRoute
						path='/trip-request'
						exact
						component={CreateRequestView}
					/>
					<ProtectedRoute path='/destinations' exact component={HomePage} />
					<ProtectedRoute path='/approved-trips' exact component={HomePage} />
					<ProtectedRoute
						path='/profile/:userId'
						exact
						component={ViewProfileContainer}
					/>
					<ProtectedRoute
						path='/profile'
						exact
						component={ViewProfileContainer}
					/>
					<ProtectedRoute path='/documents' exact component={TravelDocuments} />
					<ProtectedRoute path='/requests' exact component={RequestPage} />
					<ProtectedRoute path='/booking' exact component={ViewBooking} />
					<ProtectedRoute path='/users' component={UsersContainer} />
					<ProtectedRoute path='/login-2-fa' exact component={LoginTwoFAPage} />
					<ProtectedRoute path='/settings' component={SettingsPage} />
					<Redirect exact from='/' to='home' />
					<Route component={NotFound} />
				</Switch>
			</div>
			<ToastContainer />
			<ChatView />
			<Footer />
		</Router>
	);
};

const mapStateToProps = state => ({
	isAuthenticated: state.authState.isAuthenticated,
});

const mapDispatchToProps = {
	setAuthenticate,
	updateNavbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
	isAuthenticated: Proptypes.bool.isRequired,
	setAuthenticate: Proptypes.func.isRequired,
	updateNavbar: Proptypes.func.isRequired,
};
