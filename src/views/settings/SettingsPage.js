/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useRadioButtons from '../../utils/useRadioButtons';
import {
	disable2FA,
	get2FA,
	sendFATokenText,
	set2FA,
	verify2FA,
} from '../../store/actions/twoFactorAuthActions';
import TwoFAPage from './twoFA/TwoFAPage';

export const SettingsPage = ({
	set2FactorAuth,
	get2FactorAuth,
	disable2FactorAuth,
	verify2FactorAuth,
	authState,
	sendFATokenText,
}) => {
	const [twoFAType, setTwoFAType] = useRadioButtons({
		name: 'twoFAType',
		initialState: 'none',
	});
	const [smsSent, setSmsSent] = useState(false);
	const [twoFaStep, setTwoFaStep] = useState(null);
	const [token, setToken] = useState('');
	const [msg, setMsg] = useState(null);
	const [verify, setVerify] = useState(false);
	const [status, setStatus] = useState(false);

	const twoFAStatus = {
		none: "You haven't set any Two Factor Authentication method yet.",
		sms_text: 'You have SMS Text Two Factor Authentication method active.',
		authenticator_app:
			'You have AUTHENTICATOR APP Two Factor Authentication method active.',
		sms_text_temp:
			// eslint-disable-next-line max-len
			'You have SMS TEXT Two Factor Authentication method pending for activation.',
		authenticator_app_temp:
			// eslint-disable-next-line max-len
			'You have Authenticator app Two Factor Authentication method pending for activation.',
	};

	useEffect(() => {
		get2FactorAuth();
	}, [authState.twoFAType, twoFaStep, verify]);

	useEffect(() => {
		setStatus(twoFAStatus[authState.twoFAType]);
	}, [authState, twoFAType, token, msg, smsSent, verify]);

	useEffect(() => {
		if (authState.isTokenValid === true) {
			setTwoFaStep(null);
			setToken('');
		}
		if (authState.isTokenValid === false) {
			setMsg('Invalid Token!');
			setTimeout(() => setMsg(null), 5000);
		}
	}, [authState.isTokenValid]);

	const handleTwoFactorSetting = () => {
		set2FactorAuth(twoFAType);
		if (twoFAType !== 'sms_text_temp' || authState.phoneNumber !== null) {
			setTwoFaStep(twoFAType);
		}
	};

	return (
		<div className='container mt-4 pt-5'>
			<div className='row'>
				<div className='col-12 col-sm-3'>
					<h2>Settings</h2>
				</div>
			</div>
			<div className='row'>
				<div className='col-12 col-md-3 mt-3'>
					<div className='card border-light rounded'>
						<div className='card-body'>
							<div className='list-group' id='list-tab' role='tablist'>
								<a
									className='list-group-item list-group-item-action active'
									id='list-2fa-list'
									data-toggle='list'
									href='#list-2fa'
									role='tab'
									aria-controls='2fa'
									data-testid='two-fa-menu'
								>
									Two Factor Authentication
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-9 mt-3'>
					<div className='card border-light rounded'>
						<div className='card-body'>
							<div className='tab-content' id='nav-tabContent'>
								<TwoFAPage
									twoFaStep={twoFaStep}
									authState={authState}
									status={status}
									setTwoFAType={setTwoFAType}
									msg={msg}
									token={token}
									smsSent={smsSent}
									setToken={setToken}
									twoFAType={twoFAType}
									handleTwoFactorSetting={handleTwoFactorSetting}
									disable2FactorAuth={disable2FactorAuth}
									sendFATokenText={sendFATokenText}
									setSmsSent={setSmsSent}
									verify2FactorAuth={verify2FactorAuth}
									setVerify={setVerify}
									setTwoFaStep={setTwoFaStep}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

SettingsPage.propTypes = {
	set2FactorAuth: PropTypes.func.isRequired,
	get2FactorAuth: PropTypes.func.isRequired,
	disable2FactorAuth: PropTypes.func.isRequired,
	verify2FactorAuth: PropTypes.func.isRequired,
	authState: PropTypes.any.isRequired,
	sendFATokenText: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ authState: state.twoFactorAuthState });
const mapDispatchToProps = {
	set2FactorAuth: set2FA,
	get2FactorAuth: get2FA,
	disable2FactorAuth: disable2FA,
	verify2FactorAuth: verify2FA,
	sendFATokenText,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
