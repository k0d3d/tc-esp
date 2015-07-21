var
    OAuth2Strategy = require('passport-oauth2');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });


    passport.use( new OAuth2Strategy({
      authorizationURL: 'http://localhost:3333/oauth/authorize',
      tokenURL: 'http://localhost:3333/oauth/authorize/decision',
      clientID: 'KINqvCJBKhgZ5JCq',
      clientSecret: 'mrBjOTDxs6toaTEeczjOMOmrhrufNleg',
      callbackURL: 'http://localhost:3000/oauth/callback',
      passReqToCallback: false
    },
      function (accessToken, refreshToken, profile, done) {

      })
    );



};