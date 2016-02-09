
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
  ]);


app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider){
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

    $httpProvider.interceptors.push(['$q', 'api_config', '$rootScope', function ($q, api_config, $rootScope) {
        return {
            'request': function (config) {
              $rootScope.$broadcast('app-is-requesting', true);
               if (config.url.indexOf('/resource/') > -1 ) {
                  config.url = api_config.CONSUMER_API_URL + '' + config.url;
                  return config || $q.when(config);
                } else {
                 return config || $q.when(config);
                }
            },
            'response': function (resp) {
                $rootScope.$broadcast('app-is-requesting', false);
                // appBootStrap.isRequesting = false;
                 return resp || $q.when(resp);
            },
            // optional method
           'responseError': function(rejection) {
              // do something on error
              $rootScope.$broadcast('app-is-requesting', false);
              return $q.reject(rejection);
            },
            // optional method
           'requestError': function(rejection) {
              // do something on error
              $rootScope.$broadcast('app-is-requesting', false);
              return $q.reject(rejection);
            }

        };
    }]);
}]);


app.controller('main', ['$scope', 'requests', function ($scope, requests) {
  $scope.do_logout = function do_logout () {
    requests.logout();
  };

  $scope.offset = 0;
  $scope.currentPage = 1;
  $scope.itemsPerPage =5;

 $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };


}]);


app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
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

