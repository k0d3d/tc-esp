var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util');

var add_set_request = function (request, accessToken, config) {
  console.log(accessToken);
  return request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
};


module.exports = function (resource) {

  //  Get all questions
  resource.get('/questions', function (req, res, next) {
    // var PimpCupJuicy = request.defaults({
    //   headers: {
    //     'Authorization' : 'Bearer ' + req.user.accessToken
    //   },
    //   baseUrl: config.tagChiefOAuth.server
    // });

    add_set_request(request, req.user.accessToken, config)
    .get({
      url: config.tagChiefOAuth.endpoints.questions.query_all,
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

  // Adds a new question
  resource.post('/questions', function (req, res, next) {
    add_set_request(request, req.user.accessToken, config)
    .post({
      url: config.tagChiefOAuth.endpoints.questions.add,
      body: req.body,
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
  resource.delete('/questions/:qid', function (req, res, next) {
    add_set_request(request, req.user.accessToken, config)
    .del({
      url: util.format(config.tagChiefOAuth.endpoints.questions.delete, req.params.qid)
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