const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET || 'sports_tournament_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
});
