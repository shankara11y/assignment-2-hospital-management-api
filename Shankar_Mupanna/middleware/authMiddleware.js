const passport = require('passport');

const isAuthenticated = passport.authenticate('local', { session: false });

module.exports = isAuthenticated;
