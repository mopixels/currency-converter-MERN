import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EuroRow from './components/EuroRow';
import ForeignRow from './components/ForeignRow';
import './App.css';

function App() {
	const [allCurrencies, setAllCurrencies] = useState();
	const [refreshDate, setRefreshDate] = useState();

	const [eur, setEur] = useState();
	const [foreignCurrency, setForeignCurrency] = useState();
	const [selectedRate, setSelectedRate] = useState();
	const [selectedCurrencyName, setSelectedCurrencyName] = useState();
	const [fromEuro, setFromEuro] = useState(true);

	let foreignAmount, eurAmount;

	//MAIN CONVERSION
	if (fromEuro) {
		//AVOIDING foreignAmount IS NaN WARNING
		if (!eur) {
			foreignAmount = '';
		} else {
			const result = eur * selectedRate;
			foreignAmount = parseFloat(result.toFixed(4));
		}
	} else {
		const result = foreignCurrency / selectedRate;
		eurAmount = parseFloat(result.toFixed(4));
	}

	//HANDLING EURO INPUT
	const handleEurAmountChange = (e) => {
		setEur(e.target.value);
		setFromEuro(true);
	};

	//HANDLING OTHER CURRENCY INPUT
	const handleForeignAmountChange = (e) => {
		setForeignCurrency(e.target.value);
		setFromEuro(false);
	};

	//HANDLING CHANGED CURRENCY
	const selectedCurrency = (e) => {
		const exhangeRate = e.target.value;
		setSelectedRate(exhangeRate);
		const selectedCurrency = allCurrencies.find(
			(name) => name.currentRate === exhangeRate
		);
		setSelectedCurrencyName(selectedCurrency.fullName);
	};

	useEffect(() => {
		async function fetchData() {
			let response = await fetch('/currencies');
			response = await response.json();
			setAllCurrencies(response);
			const parsedDate = Date.parse(response[1].lastUpdated);
			const formatedDate = new Date(parsedDate).toLocaleDateString('lt-LT');
			setRefreshDate(formatedDate);
			//CALLING API AND REFRESHING THE PAGE IF NODE-CRON HAVEN'T UPDATED DATA AUTOMATICALLY
			const dateNow = new Date();
			if (dateNow.toLocaleDateString('lt-LT') !== formatedDate) {
				axios.patch('/currencies');
				window.location.reload();
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		//STOPPING BETWEEN IPUTS
		let timerFunc = setTimeout(() => {
			fromEuro
				? (eur || foreignAmount) &&
				  selectedCurrencyName &&
				  axios
						.post('/logs', {
							eurAmount: eur,
							foreignCurrencyAmount: foreignAmount,
							foreignCurrency: selectedCurrencyName,
						})
						.then((res) => console.log(res.data))
				: (eurAmount || foreignCurrency) &&
				  selectedCurrencyName &&
				  axios
						.post('/logs', {
							eurAmount: eurAmount,
							foreignCurrencyAmount: foreignCurrency,
							foreignCurrency: selectedCurrencyName,
						})
						.then((res) => console.log(res.data));
		}, 1000);
		return () => clearTimeout(timerFunc);
	}, [selectedCurrencyName, eur, foreignCurrency]);

	return (
		<div className="App">
			{allCurrencies ? (
				<div>
					<h1>Currency converter</h1>
					<p className="refreshRow">Last refresh: {refreshDate}</p>
					<div className="eurRow">
						<EuroRow
							onChangeEurAmount={handleEurAmountChange}
							eurAmount={eurAmount}
						/>
						<p className="euroSymbol">€</p>
					</div>
					<div className="arrows">⇅</div>
					<div className="foreignRow">
						<ForeignRow
							allCurrencies={allCurrencies}
							onChangeForeignAmount={handleForeignAmountChange}
							foreignAmount={foreignAmount}
							selectedCurrency={selectedCurrency}
						/>
					</div>
				</div>
			) : (
				<h3>Loading...</h3>
			)}
		</div>
	);
}

export default App;
