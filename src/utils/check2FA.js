export default ({ twoFAType, twoFASecret, twoFADataURL }) => {
	const hasActive2FA = !['_temp', 'none']
		.map(term => twoFAType && twoFAType.includes(term))
		.includes(true);

	if (hasActive2FA) {
		const twoFAData = {
			twoFAType,
			twoFASecret,
			twoFADataURL,
			twoFAVerified: false,
		};
		localStorage.setItem('bn_user_2fa', JSON.stringify(twoFAData));
	}
};
