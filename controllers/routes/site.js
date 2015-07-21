/**
 * Routes specific to mostly public views and pages.
 * Nothing here is tied to the applications business logic.
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports = function (app, ensureLoggedIn) {  // home route
  app.get('/', ensureLoggedIn('/login'), function(req, res){
    res.render('index');
  });


  /*** Start Authentication Pages  */
  app.get('/login', function(req, res){
   var callback = req.query.callback || '/';

   if (req.isAuthenticated()) {
     return res.redirect(callback);
   }
    res.render('home/login');
  });

  //Recover Password
  app.get('/recover', function(req, res){
    res.render('index');
  });

  /***End Authentication Pages */

  /** Start User Pages */



  app.get('/templates/:parent/:name', function (req, res) {
      var name = req.params.name;
      var parent = req.params.parent;
      res.render('templates/' + parent + '/' + name);
    }
  );

  // home route
  app.get('/:parent/:child', function(req, res){
    var parent = req.params.parent;
    var child = req.params.child;
    res.render(parent+'/'+child);
      //res.render('/');
  });
};