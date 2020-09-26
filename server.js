const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

require('dotenv/config');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const currenciesRoute = require('./routes/currencies');
const logsRoute = require('./routes/logs');

app.use('/currencies', currenciesRoute);
app.use('/logs', logsRoute);

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
	});
}

mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log('MongoDB Connected')
);

app.listen(port, () => console.log('Server running...'));
