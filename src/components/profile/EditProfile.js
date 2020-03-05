/* eslint-disable max-len */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import InputForm from '../templates/InputForm';
import { profileFields, profileSelect } from '../../utils/profileFields';
import SelectInput from '../templates/SelectInput';
import Toast from '../../lib/toast';
import LoadingButton from '../templates/Button';
import { clearErrors } from '../../store/actions/profile/profileActions';
import InputFile from '../templates/InputFile';
import profilePicturePlaceholder from '../../assets/images/profilePicturePlaceholder.png';

class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { props } = this;
		const { profile } = props;
		this.setState({
			currentProfilePic: profile.profilePicture,
		});
		props.clearErrors();
	}

	handleSave({ saveData, name, event }) {
		saveData({ [name]: event.target.value });
		this.setState({
			[name]: '',
		});
	}

	/**
	 * Save user input to the local state
	 * @param event
	 */
	handleInputChange(event) {
		let { value } = event.target;
		const { name } = event.target;

		if (value === '') {
			value = ' ';
		}

		this.setState({
			[name]: value,
		});
	}

	readURL(input) {
		const reader = new FileReader();
		reader.onload = e => {
			this.setState({
				currentProfilePic: e.target.result,
			});
		};
		reader.readAsDataURL(input);
	}

	handleFile({ saveData, event }) {
		const newFile = event.target.files[0];
		this.readURL(newFile);
		saveData({ profilePicture: newFile });
		this.setState({
			imageName: newFile.name,
		});
	}

	handleSaveChanges({ profile, saveProfile, errors }) {
		let error;
		Object.keys(errors).forEach(key => {
			if (errors[key] !== null) {
				error = 1;
			}
		});
		if (error === 1) {
			Toast('error', 'Errors found, please review information');
			return;
		}
		if (typeof profile.profilePicture === 'string') {
			const saveProfileObj = { ...profile };
			delete saveProfileObj.profilePicture;
			saveProfile(saveProfileObj);
		} else {
			saveProfile(profile);
		}
	}

	render() {
		const {
			profile,
			saveData,
			managers,
			errors,
			saveProfile,
			loading,
			isEditing,
			revertChanges,
		} = this.props;

		const { state, handleSaveChanges } = this;
		if (Object.keys(profile).length < 1) {
			return <div>Please Wait....</div>;
		}
		if (!isEditing) {
			return <Redirect to='/profile' />;
		}
		return (
			<div className='justify-content-center update-profile'>
				<form
					onSubmit={e => {
						e.preventDefault();
						handleSaveChanges({
							profile,
							saveProfile,
							errors,
							isEditing,
						});
					}}
				>
					<div className='profilePicContainer mb-3'>
						<InputFile
							name='profilePicture'
							testId='profilePicture'
							accept='image/png, image/jpeg, image/jpg'
							value={state.imageName || ''}
							onChange={event => this.handleFile({ saveData, event })}
						/>
						<div className='profilePicDiv'>
							<img
								src={state.currentProfilePic || profilePicturePlaceholder}
								className='img-thumbnail profilePicImg rounded-circle'
								alt='Current ProfilePic'
							/>
						</div>
					</div>
					<div className='grid-input'>
						{profileFields.map(
							({ id, placeholder, name, type, label, error }) => (
								<InputForm
									key={id}
									placeholder={placeholder}
									name={name}
									type={type}
									value={state[name] || profile[name] || ''}
									label={label}
									onChange={event => this.handleInputChange(event)}
									error={errors[error]}
									onBlur={event => this.handleSave({ saveData, name, event })}
									classNames={`form-control form-control-sm ${errors[error] &&
										'is-invalid'}`}
								/>
							),
						)}
						<SelectInput
							name='gender'
							value={profile.gender || 0}
							label='Gender'
							placeholder='Select Gender'
							option={profileSelect.gender}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({ saveData, name: 'gender', event })
							}
							classNames='form-control form-control-sm'
						/>

						<SelectInput
							name='lineManager'
							value={profile.lineManager.id || 0}
							label='Line Manager'
							selected={state.gender || ''}
							placeholder='Line Manager'
							option={managers.map(manager => {
								const obj = {};
								obj.id = manager.id;
								obj.name = `${manager.firstName} ${manager.lastName}`;
								obj.value = manager.id;
								return obj;
							})}
							error={errors.lineManagerError}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({ saveData, name: 'lineManager', event })
							}
							classNames={`form-control form-control-sm 
              ${errors.lineManagerError && 'is-invalid'}`}
						/>

						<SelectInput
							name='preferredCurrency'
							value={profile.preferredCurrency || 0}
							label='Preferred Currency'
							placeholder='Preferred Currency'
							option={profileSelect.preferredCurrency}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({ saveData, name: 'preferredCurrency', event })
							}
							classNames='form-control form-control-sm'
						/>
						<SelectInput
							name='preferredLanguage'
							value={profile.preferredLanguage || 0}
							label='Preferred Language'
							placeholder='Preferred Language'
							option={profileSelect.language}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({ saveData, name: 'preferredLanguage', event })
							}
							classNames='form-control form-control-sm'
						/>
					</div>
					<div className='row justify-content-center'>
						<LoadingButton
							value='Save Changes'
							buttonLoading={loading}
							classNames='btn save-btn  btn-success btn-rounded-border'
						/>
						<Link
							to='/profile'
							className='btn save-btn  btn-danger btn-rounded-border ml-2'
							onClick={() => revertChanges()}
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	profile: state.profileState.userProfile,
	currentUserId: state.profileState.currentUserId,
	loggedIn: state.loginState.loggedIn,
	loading: state.loadingState.buttonLoading,
});

EditProfile.propTypes = {
	profile: PropTypes.instanceOf(Object).isRequired,
	saveData: PropTypes.func.isRequired,
	managers: PropTypes.instanceOf(Array).isRequired,
	errors: PropTypes.instanceOf(Object).isRequired,
	saveProfile: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	revertChanges: PropTypes.func.isRequired,
	isEditing: PropTypes.bool.isRequired,
	clearErrors: PropTypes.func.isRequired,
};

EditProfile.defaultProps = {
	loading: null,
};

export default connect(mapStateToProps, {
	clearErrors,
})(EditProfile);
