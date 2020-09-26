import React from 'react';
import './ForeignRow.css';

const ForeignRow = ({
	allCurrencies,
	foreignAmount,
	onChangeForeignAmount,
	selectedCurrency,
}) => {
	//FILTERING OUT CURRENCIES WITHOUT EXCHANGE RATE
	const convertableCurrencies = allCurrencies.filter(
		(currency) => currency.currentRate.length > 0
	);

	return (
		<div>
			<input
				type="number"
				className="input"
				value={foreignAmount}
				onChange={onChangeForeignAmount}
				className="foreignInputStyle"
			/>
			<select
				defaultValue=""
				onChange={selectedCurrency}
				className="currencyDropdown"
			>
				<option value="" disabled hidden>
					Choose currency
				</option>
				{convertableCurrencies.map((item) => (
					<option key={item._id} value={item.currentRate}>
						{item.shortName} | {item.fullName}
					</option>
				))}
			</select>
		</div>
	);
};

export default ForeignRow;
