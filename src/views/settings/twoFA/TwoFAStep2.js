/*
eslint-disable
jsx-a11y/label-has-associated-control,
jsx-a11y/img-redundant-alt,
react/prop-types
*/
import React from 'react';

/**
 * TwoFAStep2
 *
 * @param twoFaStep
 * @param msg
 * @param token
 * @param smsSent
 * @param setToken
 * @param authState
 * @returns {*}
 * @constructor
 */

const TwoFAStep2 = ({
	twoFaStep,
	msg,
	token,
	smsSent,
	setToken,
	authState,
}) => {
	return (
		<div className='row'>
			<div className='col-12 col-md-6'>
				{twoFaStep === 'sms_text_temp' && (
					<div className='alert alert-secondary d-flex justify-content-center'>
						<i className='fa fa-mobile big-icon' aria-hidden='true' />
					</div>
				)}
				{twoFaStep === 'authenticator_app_temp' && (
					<>
						<div className='card'>
							<div className='card-body'>
								<div className='row'>
									<div className='col-12'>Scan the QR code below.</div>
								</div>
								<img alt='Embedded Image' src={authState.twoFADataURL} />
								<div className='row'>
									<h6 className='col-12'>Or type the full secret:</h6>
									<br />
									<div className='col-12'>{authState.twoFASecret}</div>
								</div>
							</div>
						</div>
						<br />
					</>
				)}
			</div>
			<div className='col-12 col-md-6'>
				{msg && (
					<div className='alert alert-danger' role='alert'>
						{msg}
					</div>
				)}
				<div className='card'>
					<div className='card-body'>
						<div className='form-row'>
							<label htmlFor='token'>Type token</label>
							<input
								data-testid='token_input'
								type='number'
								className='form-control'
								id='token'
								value={token}
								disabled={twoFaStep === 'sms_text_temp' && smsSent === false}
								onChange={e => setToken(e.target.value)}
								required
							/>
						</div>
					</div>
				</div>
				<br />
			</div>
		</div>
	);
};

export default TwoFAStep2;
