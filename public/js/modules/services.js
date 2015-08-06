var services = angular.module('services', []);
services.factory('requests', ['$http', function ($http) {
  return {
    logout: function () {
      return $http.post('/logout')
        .then(function () {
            window.location = '/login';
        });
    }
  };
}]);

services.factory('UserService', ['$resource', function ($resource) {
  // return {
  //   user: $resource('/resource/users/:user', {user: '@userId'}),
  //   users: function () {
  //     return $http.get('/resource/users');
  //   }
  // };
  return $resource('/resource/users/:user', {
    user: '@userId',
    page: '@page',
    rpp: '@rpp',
    q: 'q'
  }, {
    update:{
      method:'PUT',
      isArray: true
    },
  });
}]);

services.factory('LocationService', ['$resource', function ($resource) {

  return $resource('/resource/locations/:locationId', {
    locationId: '@locationId',
    page: '@page',
    rpp: '@rpp',
    q: 'q',
    listType: '@listType',
    cid: '@cid'
  }, {
    update:{
      method:'PUT',
      isArray: true
    },
  });
}]);