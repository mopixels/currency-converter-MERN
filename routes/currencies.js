const express = require('express');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const _ = require('lodash');
const cron = require('node-cron');
const Currencies = require('../models/Currency');
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const currencies = await Currencies.find();
		res.json(currencies);

		console.log('when? ');
	} catch (err) {
		res.json({ message: err });
	}
});

router.patch('/', async (req, res) => {
	apiCall(req, res);
});
cron.schedule('* 8 * * *', async () => {
	apiCall();
});

const apiCall = (req, res) => {
	axios
		.get(
			`https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU`
		)
		.then((response) => {
			parseString(response.data, async (err, result) => {
				if (err) {
					res.json(err);
				} else {
					const formatedResult = result.FxRates.FxRate;
					const filteredData = formatedResult.map((item) =>
						_.pick(item, ['CcyAmt[1]'])
					);
					try {
						await Currencies.bulkWrite(
							filteredData.map((item) => ({
								updateOne: {
									filter: { shortName: item.CcyAmt[1].Ccy[0] },
									update: {
										$set: {
											currentRate: item.CcyAmt[1].Amt[0],
											lastUpdated: Date.now(),
										},
									},
								},
							}))
						).then(() => {
							console.log('API call at', Date.now());
						});
					} catch (err) {
						console.log(err);
					}
				}
			});
		});
};

// router.post('/', async (req, res) => {
// 	axios
// 		.get(`https://www.lb.lt//webservices/FxRates/FxRates.asmx/getCurrencyList`)
// 		.then((response) => {
// 			parseString(response.data, async (err, result) => {
// 				if (err) {
// 					console.log(err);
// 				} else {
// 					const unnestedData = result.CcyTbl.CcyNtry;
// 					const filteredData = unnestedData.map((item) =>
// 						_.pick(item, ['Ccy', 'CcyNm[1]._'])
// 					);

// 					try {
// 						Currencies.insertMany(
// 							filteredData.map((item) => ({
// 								shortName: item.Ccy[0],
// 								fullName: item.CcyNm[1]._,
// 								currentRate: '',
// 							}))
// 						).then((data) => {
// 							res.json(data);
// 						});
// 					} catch (err) {
// 						res.json({ message: err });
// 					}
// 				}
// 			});
// 		});
// });

module.exports = router;
