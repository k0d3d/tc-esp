var request = require('request'),
    util = require('util'),
    debug = require('debug')('tagchief'),
    queryString = require('querystring'),
    url = require('url'),
    OAuthModel = require('../../models/oauth2'),
    config = require('config');

module.exports = function (app, passport) {

  //POST /login
  //*
  //Initial Basic Authentication using resource owner credentials
  //i.e. Username and Password
  app.post('/login', function(req, res, next) {
    var userEmail = req.body.email, userPassword = req.body.password;
    // request.defaults({
    //   baseUrl: config.tagChiefOAuth.server,
    //   auth:{
    //     user: userEmail,
    //     pass: req.body.password
    //   }
    // });
    request
      .post({
        baseUrl: config.tagChiefOAuth.server,
        url: config.tagChiefOAuth.authenticationUrl,
        auth:{
          user: userEmail,
          pass: userPassword
        }
      }, function (err, resp, body) {
        // console.log(arguments);
        if (err) {
          // res.status(resp.statusCode).json(err.message);
          next(err);
          return;
        }

        if (resp.statusCode === 401) {
          res.status(401).render('home/login', {
            errorMessage: 'Wrong Credentials',
            email: userEmail
          });
          return;
        }

        /*
        request client secret and client key
         */
        request.get({
          baseUrl: config.tagChiefOAuth.server,
          url: util.format(config.tagChiefOAuth.clientCheckUrl, userEmail),
          auth:{
            user: userEmail,
            pass: userPassword
          }
        }, function (err, resp, csBody) {
          csBody = JSON.parse(csBody);
          if (err) {
            next(err);
            // res.status(resp.statusC?ode).json(err.message);
            return;
          }

          if (resp.statusCode === 401) {
            res.status(401).render('home/login', {
              errorMessage: 'Wrong Credentials',
              email: userEmail
            });
            return;
          }
          if (!csBody) {
            //create a new client
            request.post({
              baseUrl: config.tagChiefOAuth.server,
              url: config.tagChiefOAuth.clientCreateUrl,
              body: {
                name: 'ESP',
                deviceId: 'OAuth00000',
                email: userEmail
              },
              json: true,
              auth:{
                user: userEmail,
                pass: userPassword
              }
            }, function (err, resp, body) {
              if (err) {
                next(err);
                // res.status(resp.statusC?ode).json(err.message);
                return;
              }

              if (resp.statusCode === 401) {
                res.status(401).render('home/login', {
                  errorMessage: 'Wrong Credentials',
                  email: userEmail
                });
                return;
              }
              var csBody = JSON.parse(body);
              //store in session for later
              req.session.userClientData = csBody;
              req.session.userClientData.userEmail = userEmail;

              // debug('%soauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=read%20write&email=%s&password=%s', config.tagChiefOAuth.server, csBody.clientKey, config.tagChiefOAuth.server + config.tagChiefOAuth.redirectUrl, userEmail, userPassword);
              res.redirect(util.format('%soauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=read%20write&email=%s&password=%s',
                config.tagChiefOAuth.server, csBody.clientKey, url.resolve(config.app.server, config.tagChiefOAuth.redirectUrl),
                userEmail, userPassword));
            });
          } else {

            //store in session for later
            console.log(csBody)
            req.session.userClientData = csBody;
            req.session.userClientData.userEmail = userEmail;

            // debug('%soauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=read%20write&email=%s&password=%s', config.tagChiefOAuth.server, csBody.clientKey, config.tagChiefOAuth.server + config.tagChiefOAuth.redirectUrl, userEmail, userPassword);
            res.redirect(util.format('%soauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=read%20write&email=%s&password=%s',
              config.tagChiefOAuth.server, csBody.clientKey, url.resolve(config.app.server, config.tagChiefOAuth.redirectUrl),
              userEmail, userPassword));
          }
        });
      });
  });


  app.get('/auth_callback', function (req, res, next) {

    var requestToken = req.query.code,
        clientKey = req.session.userClientData.clientKey,
        clientSecret = req.session.userClientData.clientSecret,
        userEmail =  req.session.userClientData.userEmail;

    var reqOptions = {
          baseUrl: config.tagChiefOAuth.server,
          url: config.tagChiefOAuth.authorizationUrl,
          auth: {
            user: clientKey,
            pass: clientSecret
          },
          form: queryString.parse(util.format('client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code&code=%s',
                      clientKey, clientSecret,
                      url.resolve(config.app.server, config.tagChiefOAuth.redirectUrl),
                      requestToken))

        };
    debug(reqOptions);
    request.post(reqOptions, function (err, resp, body) {
      if (err) {
        // res.status(resp.statusCode).json(err.message);
        next(err);
        return;
      }
      var saveNewClientUser = {
        clientKey: clientKey,
        email: userEmail,
        accessToken:JSON.parse(body).access_token
        // expiryDate: Date.now() +
      };
      var newUser = new OAuthModel();
      if (resp.statusCode < 400) {

        newUser.create(saveNewClientUser)
        .then(function(user) {
          req.login({
            userId: user._id,
            clientKey: clientKey,
            userEmail: userEmail,
            accessToken: user.accessToken,
          }, function (err) {
             if (err) {
               return next(err);
             }
            res.redirect('/');
          });
        }, function (err) {
          next(err);
        });
      } else {
        res.status(400);
      }
    });

  });

  app.post('/exit', function (req, res) {
    req.logout();
    res.redirect('/login');
  });

};