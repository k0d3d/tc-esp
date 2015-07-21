var
    _ = require('lodash'),
    request = require('request'),
    config = require('config'),
    Utils = require('../../lib/utility');

module.exports = function (resource) {
  // var users = new User();

  resource.route('/users')
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
  .patch(function (req, res, next) {
    var users = new User(), u = new Utils();

    var id = u.isEmail(req.body.email) ? {email: req.body.email} : {phoneNumber: req.body.email};
    console.log(id);
    users.findUserObject(id)
    .then(function (userObject) {
      return users.sendPasswordResetMobile(userObject, req.body.deviceId);
    }, function () {
      res.status(404).json(false);
    })
    .then(function () {
      res.json(true);
    }, function (err) {
      next(err);
    });
  });


  //
  //User Profile
  //
  resource.route('/me')
    //updates the profile for the currently
  //logged in user
  .put(function (req, res, next) {
    console.log(req.body);
    var userId = req.user._id;
    var users = new User();
    users.updateUserAccount(userId, _.extend({scope: 'PROFILE'}, _.pick(req.body, ['firstname', 'lastname', 'phoneNumber'])))
    .then(function (r) {
      res.json(r);
    }, function (err) {
      console.log(err);
      next(err);
    });
  })
  //gets the profile information for the curently logged
  //in user
  .get(function (req, res, next) {
    var userId = req.user._id;
    var users = new User();
    users.getProfile(userId, 'BASIC')
    .then(function (r) {
      res.json(200, r);
      // res.json(200, _.extend(req.user.toJSON(), r));
      // res.render('user/profile', {
      //   userProfile: r || {},
      //   userData: req.user
      // });
    }, function (err) {
      next(err);
    });
  });

};