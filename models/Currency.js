const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
	shortName: String,
	fullName: String,
	currentRate: String,
	lastUpdated: Date,
});

module.exports = mongoose.model('Currencies', CurrencySchema);
