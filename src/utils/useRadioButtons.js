import React from 'react';

export default ({ name, initialState }) => {
	const [value, setState] = React.useState(initialState);

	const handleChange = e => setState(e.target.value);

	const inputProps = { name, type: 'radio', onChange: handleChange };

	return [value, inputProps];
};
