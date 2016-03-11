
var app = angular.module('tagChiefStatsApp', [
  'ui.router',
  'users',
  'locations',
  'services',
  'ngResource',
  'tc.questions.ng',
  'tc.stats.ng',
  'GoogleMapsInitializer',
  'tc.config.ng',
  'cgNotify'
  ]);


app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  'httpWatchman',
  function ($stateProvider, $urlRouterProvider, $httpProvider, hm){
    $stateProvider
    .state('location', {
      url: '/locations/:locationId',
      views: {
        'pageContent' : {
          templateUrl: '/locations/overview',
          controller: 'LocationPageController',
        }
      },
    })
    .state('locations', {
      url: '/locations?entry_type?category?is_search?lat?lng?name?page',
      views: {
        'pageContent' : {
          templateUrl: '/locations/places',
          controller: 'LocationController',
        }
      },
    })
    .state('users', {
      url: '/users',
      views: {
        'pageContent' : {
          templateUrl: '/users/list',
          controller: 'UserController',
        }
      },
    })
    .state('checkinfeedback', {
      url: '/locations/:locationId/checkin/:checkinId',
      views: {
        'pageContent' : {
          templateUrl: '/locations/feedback',
          controller: 'FeedbackController',
        }
      },
    })
    .state('activities', {
      url: '/activities',
      views: {
        'pageContent' : {
          templateUrl: '/locations/activities',
          controller: 'ActivitiesController',
        }
      }
    })
    .state('login', {
      url: '/login',
      views: {
        'pageContent' : {
          // controller: 'filesController',
        }
      }
    });

    $urlRouterProvider.otherwise('/activities');

    $httpProvider.interceptors.push(hm);
}]);


app.controller('main', ['$scope', 'requests', function ($scope, requests) {
  $scope.do_logout = function do_logout () {
    requests.logout();
  };

  requests.getMe()
  .then(function(user){
    $scope._user = user.data;
  });

  $scope.pagination_config = {};

  $scope.pagination_config.offset = 0;
  $scope.pagination_config.currentPage = 1;
  $scope.pagination_config.itemsPerPage = 10;

 $scope.pagination_config.prevPage = function() {
    if ($scope.pagination_config.currentPage > 0) {
      $scope.pagination_config.currentPage--;
    }
  };

  $scope.pagination_config.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? true : false;
  };

  $scope.pagination_config.pageCount = function(items) {
    return Math.ceil(items.length/$scope.pagination_config.itemsPerPage)-1;
  };

  $scope.pagination_config.nextPage = function(items) {
    if ($scope.pagination_config.currentPage < $scope.pagination_config.pageCount(items)) {
      $scope.pagination_config.currentPage++;
    }
  };

  $scope.pagination_config.nextPageDisabled = function(items) {
    // return $scope.pagination_config.currentPage === $scope.pagination_config.pageCount(items) ? true : false;
  };


}]);


app.filter('offset', function() {
  return function(input, position, itemsPerPage) {
    if (input && input.length) {
      position = parseInt(position);
      if (position === 0) {
        position = 1;
      }
      return input.slice(position - 1 , itemsPerPage + 1);
    } else {
      return [];
    }

  };
});

app.directive('pageContent', [function () {
  return {
    restrict:'C',
    link: function (s, e) {
      $(window).on('resize', function() {
        $(e).height($(window).height()).css({
          'overflow-y': 'overlay'
        });
      });
      $(e).height($(window).height()).css({
          'overflow-y': 'overlay'
        });
    }
  };
}]);

app.factory('httpWatchman',

      [
      '$q',
      'api_config',
      '$rootScope',
      'notify',
      function ($q, api_config, $rootScope, notify) {
        var pending_alert;
        return {
            'request': function (config) {
              $rootScope.$broadcast('app-is-requesting', true);
               if (config.url.indexOf('/resource/') > -1 ) {
                  // config.url = api_config.CONSUMER_API_URL + '' + config.url;
                  pending_alert = notify({
                    message:'Requesting',
                    templateUrl:'/angular-notify.html',
                    duration: 0,
                    classes: 'alert-info'
                  } );
                  console.log(config.url);
                  return config || $q.when(config);
                } else {
                 return config || $q.when(config);
                }
            },
            'response': function (resp) {
                $rootScope.$broadcast('app-is-requesting', false);
                if(pending_alert) {
                  pending_alert.close();
                }
                notify({
                    message:'Done',
                    templateUrl:'/angular-notify.html',
                    duration: 3000,
                    classes: 'alert-success'
                } );
                // appBootStrap.isRequesting = false;
                 return resp || $q.when(resp);
            },
            // optional method
            'responseError': function(rejection) {
              // do something on error
              $rootScope.$broadcast('app-is-requesting', false);
              notify({
                    message:'Something went wrong.',
                    templateUrl:'/angular-notify.html',
                    duration: 3000,
                    classes: 'alert-danger'
                } );
              return $q.reject(rejection);
            },
            // optional method
            'requestError': function(rejection) {
              // do something on error
              notify({
                    message:'Something went wrong.',
                    templateUrl:'/angular-notify.html',
                    duration: 3000,
                    classes: 'alert-danger'
                } );
              $rootScope.$broadcast('app-is-requesting', false);
              return $q.reject(rejection);
            }
        };
}]);