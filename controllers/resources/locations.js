var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    util = require('util'),
    csv = require('json-csv');


function process_request_all_locations (requestInstance, req, res, next) {
    requestInstance.get({
      url: config.tagChiefOAuth.endpoints.locations.query_all,
      qs: req.query,
      json: true
    }, function (err, resp, bd) {

      if (err) {
        next(err);
      }
      if (resp && resp.statusCode < 400) {
        res.json(bd);
      } else {
        res.status(resp.statusCode).end();
      }
    });
}
function process_request_attach_locations_to_user (requestInstance, req, res, next) {
    requestInstance.get({
      url: config.tagChiefOAuth.endpoints.locations.query_all,
      qs: req.query,
      json: true
    }, function (err, resp, bd) {

      if (err) {
        next(err);
      }
      if (resp && resp.statusCode < 400) {
        res.json(bd);
      } else {
        res.status(resp.statusCode).end();
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

    // req.query.entry_type = 'user';

    // if its admin, we can choose.
    if (req.user.email === 'super.user@tagchief.com' || req.user.email === 'michael.rhema@gmail.com') {
      req.user.isAdmin = true;
      req.query.entry_type = req.query.entry_type || 'system';
    }

    if (req.query.listType === 'search' || req.query.listType === 'list_all_locations'){
      return process_request_all_locations(all_locations_request, req, res, next);
    }

    if (req.query.listType === 'attach_locations_to_user') {
      return process_request_attach_locations_to_user(all_locations_request, req, res, next);
    }

    next(new Error('Invalid Request'));
  });
  resource.route('/feedback')
  .get(function (req, res, next) {
    var all_locations_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_locations_request.get({
      url: util.format(config.tagChiefOAuth.endpoints.feedback.query_all),
      qs: req.query,
      json: true
    }, function (err, resp, bd) {
      if (err) {
        next(err);
      }
      if (resp && resp.statusCode < 400) {
        res.json(bd);
      } else {
        next(new Error('Unknown Connection Error'));
      }
    });
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
      if (resp && resp.statusCode < 400) {
        res.json(bd);
      } else {
        next(new Error('Unknown Connection Error'));
      }
    });
  });

  resource.get('/locations/activity/export', function (req, res, next) {
    var all_locations_request = request.defaults({
      headers: {
        'Authorization' : 'Bearer ' + req.user.accessToken
      },
      baseUrl: config.tagChiefOAuth.server
    });
    all_locations_request.get({
      url: config.tagChiefOAuth.endpoints.feedback.query_all,
      qs: req.query,
      json: true
    }, function (err, resp, bd) {
      if (err) {
        next(err);
      }
      if (resp && resp.statusCode < 400) {
        csv.csvBuffered(bd,{
          fields: [
                {
                  name: 'questions',
                  label: 'question'
                },
                {
                  name: 'dateTriggered',
                  label: 'dateTriggered'
                },
                {
                  name: 'decision',
                  label: 'decision'
                },
                {
                  name: 'hasComment',
                  label: 'comment'
                },
                {
                  name: 'locationId.name',
                  label: 'locationname',
                  quoted: true
                },
                {
                  name: 'locationId',
                  label: 'address',
                  quoted: true
                },
                {
                  name: 'timeUpdated',
                  label: 'timeUpdated'
                }

          ]
        }, function (err, outputcsv) {
          if (err) {
            return next(err);
          }
          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="activities.csv"',
            'Content-Description': 'File Transfer',
            'Content-Transfer-Encoding': 'binary'

          });

          res.send(outputcsv);
        });
      } else {
        // res.status(400);
        next(new Error('Unknown Connection Error'));
      }
    });
  });



};