const express = require('express');
const Logs = require('../models/Log');
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const allLogs = await Logs.find();
		res.json(allLogs);
	} catch (err) {
		res.json({ message: err });
	}
});

router.post('/', async (req, res) => {
	const log = new Logs({
		eurAmount: req.body.eurAmount,
		foreignCurrencyAmount: req.body.foreignCurrencyAmount,
		foreignCurrency: req.body.foreignCurrency,
	});
	try {
		const savedLog = await log.save();
		res.json(savedLog);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
