/* eslint-disable no-shadow,
 max-len,
 jsx-a11y/img-redundant-alt,
 jsx-a11y/label-has-associated-control
*/
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { updateNavbar } from '../store/actions/navbar/navbarActions';
import LayoutForms from '../components/templates/LayoutForms';
import {
	get2FA,
	sendFATokenText,
	verify2FA,
} from '../store/actions/twoFactorAuthActions';

export const LoginTwoFAPage = ({
	updateNavbar,
	history,
	verify2FA,
	get2FA,
	twoFAData,
	sendFATokenText,
}) => {
	const bnUser2FA = localStorage.bn_user_2fa;
	const data = bnUser2FA && JSON.parse(bnUser2FA);

	const { twoFAType, twoFASecret, twoFADataURL, phoneNumber } = twoFAData;

	const categories = {
		sms_text: {
			info: 'Check your phone to get the 6 digit token',
			secret: '',
			image:
				'http://icon-library.com/images/cellphone-icon-png/cellphone-icon-png-15.jpg',
		},
		authenticator_app: {
			info:
				'Scan the following QR code with your device to get the 6 digit token',
			image: twoFADataURL,
			secret: twoFASecret,
		},
	};

	const [token, setToken] = useState('');
	const [isValidToken, setIsValidToken] = useState(true);
	const [generateToken, setGenerateToken] = useState(false);

	useEffect(() => {
		if (generateToken === true) {
			setTimeout(() => {
				setGenerateToken(false);
			}, 5000);
		}
	}, [categories, generateToken]);

	useEffect(() => {
		if (typeof twoFAData.isTokenValid !== 'undefined') {
			if (twoFAData.isTokenValid === false) {
				setIsValidToken(false);
				setTimeout(() => setIsValidToken(true), 5000);
			} else {
				updateNavbar();
				const updatedData = { ...data, twoFAVerified: true };
				localStorage.setItem('bn_user_2fa', JSON.stringify(updatedData));
				history.push('/home');
			}
		}
	}, [twoFAData.isTokenValid]);

	useEffect(() => {
		if (!bnUser2FA || data.twoFAVerified) history.push('/home');
		get2FA();
	}, []);

	return (
		<div data-testid='login_2fa_page'>
			{twoFAData.twoFAType && (
				<LayoutForms
					title='Two Factor Authentication'
					info={categories[twoFAData.twoFAType].info}
					classNames=''
					onSubmit={() => {}}
				>
					<div className='card border-0'>
						<div className='card-body text-center'>
							<img
								className='two-fa-image'
								alt='Embedded Image'
								src={categories[twoFAType].image}
							/>
							<br />
							<br />
							<div className='col-12'>{categories[twoFAType].secret}</div>
							{twoFAType === 'sms_text' && (
								<input
									data-testid='send_text_btn'
									onClick={() => {
										sendFATokenText({
											secret: twoFASecret,
											phoneNumber,
										});
										setGenerateToken(true);
									}}
									type='button'
									className='btn btn-secondary btn-block text-center'
									value='SEND ME THE TOKEN'
								/>
							)}
							<hr />
							{isValidToken === false && (
								<div className='alert alert-danger' role='alert'>
									Invalid token
								</div>
							)}
							{generateToken === true && (
								<div className='alert alert-success' role='alert'>
									Token generated
								</div>
							)}
							<div className='form-group'>
								<label htmlFor='token'>Token</label>
								<input
									name='token'
									id='token'
									type='number'
									value={token}
									onChange={e => setToken(e.target.value)}
									className='form-control text-center two-fa-token'
									placeholder='Type the token here...'
								/>
							</div>
							<input
								data-testid='verify_btn'
								onClick={() => verify2FA(token)}
								type='button'
								className='btn btn-primary btn-block text-center'
								value='VERIFY'
							/>
						</div>
					</div>
				</LayoutForms>
			)}
		</div>
	);
};

LoginTwoFAPage.propTypes = {
	history: PropTypes.shape({ push: PropTypes.func }).isRequired,
	updateNavbar: PropTypes.func.isRequired,
	verify2FA: PropTypes.func.isRequired,
	get2FA: PropTypes.func.isRequired,
	sendFATokenText: PropTypes.func.isRequired,
	twoFAData: PropTypes.any,
};

LoginTwoFAPage.defaultProps = {
	twoFAData: null,
};

const mapDispatchToProps = {
	updateNavbar,
	verify2FA,
	get2FA,
	sendFATokenText,
};

const mapStateToProps = state => ({
	twoFAData: state.twoFactorAuthState,
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(LoginTwoFAPage),
);
