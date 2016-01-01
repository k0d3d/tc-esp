var
    appConfig = require('config').express,
    express = require('express'),
    cors = require('cors');

module.exports = function (app, ensureLoggedIn) {
  appConfig.cors.options.origin = true;

  var resource = express.Router();

  resource.options('*', cors(appConfig.cors.options),
    function (req, res, next) {
      next();
    });

  resource.route('*')
  .all(cors(appConfig.cors.options),
    function(req, res, next){
      if (
        (
          (req.url === '/resource/users' && req.method === 'POST') ||
          (req.url === '/resource/users/auth'  && req.method === 'PATCH')
        )
      ) {
        next();
      } else {
        ensureLoggedIn('/login').call(null, req, res, next);
        // next();
      }
    },
    // passport.isAPIAuthenticated,
    function (req, res, next) {
      if (req.xhr) {
        res.set('WWW-Authenticate',  'xBasic realm="Resource"');
      }
      next();
    }
  );

  require('./resources/users')(resource);
  require('./resources/locations')(resource);
  require('./resources/stats')(resource);
  require('./resources/questions')(resource);

  app.use('/resource', resource);

};