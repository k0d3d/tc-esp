var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util');

var add_set_request = function (request, accessToken, config) {
  return request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
};


module.exports = function (resource) {

  //  Get all questions
  resource.put('/warden/assignee', function (req, res, next) {
    add_set_request(request, req.user.accessToken, config)
    .put({
      url: config.tagChiefOAuth.endpoints.warden.add_assigment,
      body: {locationList: req.body.locationList, assignee: req.body.assignee},
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

  // Adds a new question
  resource.put('/warden/subjectGroup', function (req, res, next) {
    add_set_request(request, req.user.accessToken, config)
    .put({
      url: config.tagChiefOAuth.endpoints.warden.modify_group,
      body: req.body,
      query: {subjectGroup: true},
      json: true
    }, function (err, resp, bd) {
      console.log(err);
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