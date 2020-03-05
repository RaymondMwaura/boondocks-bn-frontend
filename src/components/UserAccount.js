/* eslint-disable react/no-array-index-key */
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountLinks } from '../utils/userAccountLinks';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';
import { fetchUserProfile } from '../store/actions/profile/profileActions';

/**
 * UserAccount
 * @param items
 * @returns {*}
 * @constructor
 */
const UserAccount = ({ items }) => {
	const [currentPic, setCurrentPic] = useState(undefined);
	const dispatch = useDispatch();
	const profilePicture = useSelector(
		state => state.profileState.userProfile.profilePicture,
	);

	useEffect(() => {
		const { userId } = JSON.parse(localStorage.bn_user_data);
		const fetchData = async aUserId => {
			await dispatch(fetchUserProfile(aUserId));
		};
		fetchData(userId);
	}, []);

	useEffect(() => {
		if (typeof profilePicture !== 'object' && profilePicture !== undefined) {
			setCurrentPic(profilePicture);
		}
	}, [profilePicture]);

	return (
		<li
			data-testid='user-account'
			className='nav-item user-account mx-0 mx-md-3 active'
		>
			<div
				className='nav-link dropdown-toggle'
				data-toggle='dropdown'
				role='button'
				aria-haspopup='true'
				aria-expanded='false'
			>
				<span>Account</span>
				{currentPic === undefined || currentPic === '' ? (
					<div className='user-avatar'>{localStorage.name_initials}</div>
				) : (
					<img
						src={currentPic}
						className='profilePicViewsRender'
						alt='Current ProfilePic'
					/>
				)}
			</div>
			<div className='dropdown-menu'>
				{items.map((item, idx) => (
					<Link key={idx} className='dropdown-item' to={item.linkRoute}>
						{item.linkText}
					</Link>
				))}
				<Logout />
			</div>
		</li>
	);
};

UserAccount.propTypes = {
	items: PropTypes.array.isRequired,
};

export default UserAccount;
