/* eslint-disable react/no-array-index-key */
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountLinks } from '../utils/userAccountLinks';
import Logout from './auth/Logout';
import { fetchUserProfile } from '../store/actions/profile/profileActions';

/**
 * UserAccount
 * @returns {*}
 * @constructor
 */
const UserAccount = () => {
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

	let role = '';
	if (localStorage.bn_user_data) {
		role = JSON.parse(localStorage.getItem('bn_user_data')).role;
	}

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
				{[...accountLinks.general, ...(role && accountLinks[role])].map(
					(item, idx) => (
						<Link key={idx} className='dropdown-item' to={item.linkRoute}>
							{item.linkText}
						</Link>
					),
				)}
				<Logout />
			</div>
		</li>
	);
};

export default UserAccount;
