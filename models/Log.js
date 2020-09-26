const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
	eurAmount: {
		type: Number,
		required: true,
	},
	foreignCurrencyAmount: {
		type: Number,
		required: true,
	},
	foreignCurrency: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Logs', LogSchema);
