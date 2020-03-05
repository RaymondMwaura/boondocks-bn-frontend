/*
eslint-disable
react/jsx-props-no-spreading,
max-len,
jsx-a11y/label-has-associated-control,
 */
import React from 'react';
import PropTypes from 'prop-types';
import TwoFAStep2 from './TwoFAStep2';
import TwoFaStep1 from './TwoFAStep1';

/**
 * TwoFAPage
 *
 * @param twoFaStep
 * @param authState
 * @param status
 * @param setTwoFAType
 * @param msg
 * @param token
 * @param smsSent
 * @param setToken
 * @param twoFAType
 * @param handleTwoFactorSetting
 * @param disable2FactorAuth
 * @param sendFATokenText
 * @param setSmsSent
 * @param verify2FactorAuth
 * @param setVerify
 * @param setTwoFaStep
 * @returns {*}
 * @constructor
 */
const TwoFAPage = ({
	twoFaStep,
	authState,
	status,
	setTwoFAType,
	msg,
	token,
	smsSent,
	setToken,
	twoFAType,
	handleTwoFactorSetting,
	disable2FactorAuth,
	sendFATokenText,
	setSmsSent,
	verify2FactorAuth,
	setVerify,
	setTwoFaStep,
}) => {
	return (
		<div
			className='tab-pane fade show active'
			id='list-2fa'
			role='tabpanel'
			aria-labelledby='list-2fa-list'
			data-testid='two-fa-page'
		>
			<h4>Manage Two Factor Authentication</h4>
			<hr />
			<div className='row'>
				<div className='col-12 col-md-9'>
					{(twoFaStep === null || twoFaStep === 'none') &&
						authState.twoFAType && (
							<TwoFaStep1 setTwoFAType={setTwoFAType} status={status} />
						)}
					{['authenticator_app_temp', 'sms_text_temp'].includes(twoFaStep) && (
						<TwoFAStep2
							twoFaStep={twoFaStep}
							msg={msg}
							token={token}
							smsSent={smsSent}
							setToken={setToken}
							authState={authState}
						/>
					)}
				</div>
				<div className='col-12 col-md-3'>
					{twoFaStep === null || twoFaStep === 'none' ? (
						<div>
							{twoFAType !== 'none' && (
								<button
									data-testid='proceed_btn'
									type='button'
									className='btn btn-primary btn-block'
									onClick={handleTwoFactorSetting}
								>
									Proceed
								</button>
							)}
							{authState.twoFAType !== 'none' && (
								<button
									data-testid='disable_btn'
									type='button'
									className='btn btn-secondary btn-block'
									onClick={() => disable2FactorAuth()}
								>
									Disable 2FA
								</button>
							)}
						</div>
					) : (
						<div>
							{twoFaStep === 'sms_text_temp' && (
								<button
									data-testid='send_text_btn'
									type='button'
									className='btn btn-primary btn-block'
									onClick={() => {
										sendFATokenText({
											secret: authState.twoFASecret,
											phoneNumber: authState.phoneNumber,
										});
										setSmsSent(true);
									}}
								>
									Send me SMS Text
								</button>
							)}
							{(smsSent || twoFaStep === 'authenticator_app_temp') && (
								<button
									data-testid='verify_btn'
									type='button'
									className='btn btn-primary btn-block'
									onClick={() => {
										verify2FactorAuth(token);
										setVerify(true);
									}}
								>
									Verify Token
								</button>
							)}
							<button
								data-testid='back_btn'
								type='button'
								className='btn btn-secondary btn-block'
								onClick={() => {
									setTwoFaStep(null);
									setToken('');
									setSmsSent(false);
								}}
							>
								Back
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

TwoFAPage.propTypes = {
	twoFaStep: PropTypes.any,
	authState: PropTypes.shape({
		twoFAType: PropTypes.string,
		twoFADataURL: PropTypes.string,
		twoFASecret: PropTypes.string,
		phoneNumber: PropTypes.string,
	}).isRequired,
	status: PropTypes.any,
	setTwoFAType: PropTypes.shape({
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	}).isRequired,
	msg: PropTypes.any,
	token: PropTypes.any.isRequired,
	smsSent: PropTypes.any.isRequired,
	setToken: PropTypes.func.isRequired,
	twoFAType: PropTypes.any.isRequired,
	handleTwoFactorSetting: PropTypes.func.isRequired,
	disable2FactorAuth: PropTypes.func.isRequired,
	sendFATokenText: PropTypes.func.isRequired,
	setSmsSent: PropTypes.func.isRequired,
	verify2FactorAuth: PropTypes.func.isRequired,
	setVerify: PropTypes.func.isRequired,
	setTwoFaStep: PropTypes.func.isRequired,
};

TwoFAPage.defaultProps = {
	twoFaStep: null,
	status: false,
	msg: null,
};

export default TwoFAPage;
