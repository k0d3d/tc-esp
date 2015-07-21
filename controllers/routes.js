/**
 * Module dependcies
 */
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
/**
 * Expose routes
 */

module.exports = function (app, passport) {

  //User Roscources
  require('./resources')(app, ensureLoggedIn);
  //Site Routes
  require('./routes/site')(app, ensureLoggedIn);

  require('./routes/authentication')(app, passport);



};