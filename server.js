'use strict';

const express    = require('express'),
      bodyParser = require('body-parser'),
      logger     = require('morgan'),
      app        = express(),
      PORT       = process.env.PORT || 3000;


// Body parser init
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// Run Morgan for logging
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));

// Static content route
app.use(express.static(process.cwd() + '/public'));

// Controller routes
const routes = {
  api: require('./controllers/bowling_api.js')
};

app.use('/api', routes.api);

// Init server
app.listen(PORT, () => {
	if (process.env.NODE_ENV !== 'test') console.log(`App listening on port ${PORT}`);
});

// For testing
module.exports = app;