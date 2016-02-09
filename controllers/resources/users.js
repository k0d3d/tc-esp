var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util'),
    Utils = require('../../lib/utility');

module.exports = function (resource) {
  // var users = new User();

  resource.route('/users')
  .post(function (req, res, next) {
    var all_users_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_users_request.post({
      url: util.format(config.tagChiefOAuth.endpoints.users.add_new_user),
      body: req.body,
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
  })
  .get(function (req, res, next) {
    var all_users_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_users_request.get({
      url: config.tagChiefOAuth.endpoints.users.query_all,
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


  //Authentication Api Routes
  resource.route('/users/:userId')
  .put(function (req, res, next) {
    var all_users_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_users_request.put({
      url: util.format(config.tagChiefOAuth.endpoints.users.update_user, req.params.userId),
      body: req.body,
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