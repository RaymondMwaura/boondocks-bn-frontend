/* eslint-disable
jsx-a11y/label-has-associated-control,
react/prop-types,
react/jsx-props-no-spreading
*/
import React from 'react';

const TwoFaStep1 = ({ status, setTwoFAType }) => {
	return (
		<>
			<div className='alert alert-primary' role='alert'>
				{status}
			</div>
			<div className='mx-2 my-4'>
				<h6 className='text-primary'>
					Choose a method for 2 Factor authentication:
				</h6>
			</div>
			<div className='custom-control custom-radio custom-control-inline'>
				<input
					data-testid='authenticator_app_radio'
					type='radio'
					id='twoFAType1'
					name='twoFAType'
					className='custom-control-input'
					value='authenticator_app_temp'
					{...setTwoFAType}
				/>
				<label className='custom-control-label' htmlFor='twoFAType1'>
					Authenticator app
				</label>
			</div>
			<div className='custom-control custom-radio custom-control-inline'>
				<input
					data-testid='sms_text_radio'
					type='radio'
					id='twoFAType2'
					name='twoFAType'
					className='custom-control-input'
					value='sms_text_temp'
					{...setTwoFAType}
				/>
				<label className='custom-control-label' htmlFor='twoFAType2'>
					SMS Text message
				</label>
			</div>
			<br />
			<br />
		</>
	);
};

export default TwoFaStep1;
