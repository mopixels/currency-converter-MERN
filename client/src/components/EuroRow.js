import React from 'react';
import './EuroRow.css';

const EuroRow = ({ eurAmount, onChangeEurAmount }) => {
	return (
		<div>
			<input
				type="number"
				className="input"
				defaultValue={0}
				value={eurAmount}
				onChange={onChangeEurAmount}
				className="eurInputStyle"
			/>
		</div>
	);
};

export default EuroRow;
