var services = angular.module('services', []);
services.factory('requests', ['$http', function ($http) {
  return {
    logout: function () {
      return $http.post('/exit')
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
services.factory('WardenService', ['$http', function ($http) {

  return {
    bulkAssignToUser: function bulkAssignToUser (locationList, assignee) {
     return $http.put('/resource/warden/assignee', {
        locationList: locationList,
        assignee: assignee,
      });
    },
    bulkAssignToQGroup: function bulkAssignToQGroup (locationList, group) {
     return $http.put('/resource/warden/subjectGroup', {
        locationList: locationList,
        subjectGroup: group
      });
    }
  };

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
services.factory('FeedbackService', ['$resource', function ($resource) {

  return $resource('/resource/feedback', {
    page: '@page',
    rpp: '@rpp',
    q: 'q',
    listType: '@listType',
  });
}]);
services.factory('QtnService', ['$resource', function ($resource) {

  return $resource('/resource/questions', {
    listType: '@listType',
  });
}]);
services.factory('StatsService', ['$resource', function ($resource) {

  return $resource('/resource/stats', {
    listType: '@listType',
  });
}]);
