var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util'),
    Utils = require('../../lib/utility');


function process_request_all_locations (requestInstance, req, res, next) {
    requestInstance.get({
      url: config.tagChiefOAuth.endpoints.locations.query_all,
      qs: req.query,
      json: true
    }, function (err, resp, bd) {
      if (err) {
        next(err);
      }
      if (resp.statusCode < 400) {
        res.json(bd);
      } else {
        res.status(resp.statusCode);
      }
    });
}

module.exports = function (resource) {
  // var users = new User();

  resource.route('/locations')
  .get(function (req, res, next) {
    var all_locations_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    if (req.query.listType === 'search' || req.query.listType === 'list_all_locations'){
      return process_request_all_locations(all_locations_request, req, res, next);
    }

    next(new Error('Invalid Request'));
  });


  //Authentication Api Routes
  resource.route('/locations/:locationId')
  .get(function (req, res, next) {
    var all_locations_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_locations_request.get({
      url: util.format(config.tagChiefOAuth.endpoints.locations.one_location, req.params.locationId),
      qs: req.query,
      json: true
    }, function (err, resp, bd) {
      if (err) {
        next(err);
      }
      if (resp.statusCode < 400) {
        res.json(bd);
      } else {
        res.status(resp.statusCode);
      }
    });
  });
};