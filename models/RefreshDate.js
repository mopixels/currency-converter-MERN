const mongoose = require('mongoose');

const DateSchema = mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('refreshDate', DateSchema);
