/* eslint-disable
react/jsx-props-no-spreading,
no-undef, import/no-extraneous-dependencies,
no-unused-expressions,
no-return-assign,
prettier/prettier,
max-len
*/
import { Redirect, Route } from "react-router";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import JWTDecode from "jwt-decode";
import queryString from "query-string";
import toast from "../lib/toast";
import setAuthenticate from "../store/actions/authenticateAction";
import { storeToken } from "../helpers/authHelper";
import { nowSeconds } from "../lib/time";
import check2FA from "../utils/check2FA";
/**
 * ProtectedRoute
 * @param setAuthState
 * @param Component
 * @param rest
 * @returns {*}
 * @constructor
 */
export const ProtectedRoute = ({
	setAuthState,
	component: Component,
	...rest
}) => {
	setAuthState(true);

	const queries = queryString.parse(rest.location.query);

	let userData;

	if (queries.token) {
		storeToken(queries.token);
		userData = JWTDecode(queries.token);
		check2FA(queries);
	}

	const isAuthenticated = !!localStorage.bn_user_data ||
		(queries.token && (nowSeconds - userData.iat < 3));

	!isAuthenticated && toast("error", "You need to be logged in");

	return (
		<Route
			data-test='protected-route'
			render={props => ({
					"1": <Component {...props} />,
					"0": <Redirect
						to={{ pathname: "/home", state: { from: props.location } }}
					/>
				}[`${isAuthenticated * 1}`]
			)}
			{...rest}
		/>
	);
};

ProtectedRoute.propTypes = {
	component: PropTypes.any,
	location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
	setAuthState: PropTypes.func.isRequired
};

ProtectedRoute.defaultProps = {
	location: null,
	component: null,
};

export default connect(null, {
	setAuthState: setAuthenticate,
})(ProtectedRoute);
