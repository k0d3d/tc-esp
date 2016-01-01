var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util');


module.exports = function (resource) {
  resource.get('/stats', function (req, res, next) {
    var BigBangBro = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });

    BigBangBro.get({
      url: config.tagChiefOAuth.endpoints.stats.query_all,
      qs: req.query,
      json: true
    }, function (err, resp, bd) {

      if (err) {
        next(err);
      }
      if (resp && resp.statusCode < 400) {
        res.json(bd);
      } else {
        // res.status(resp.statusCode).end();
        next(new Error('Unavailable'));
      }
    });

  });
};