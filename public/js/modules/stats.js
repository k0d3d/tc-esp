var statsApp = angular.module('tc.stats.ng', []);

statsApp.config([
  '$stateProvider',
  function ($stateProvider){
    $stateProvider
    .state('statistics', {
      url: '/stats',
      views: {
        'pageContent' : {
          templateUrl: '/stats/index',
          controller: 'StatsController',
          resolve: {
            'summary_stats': function (StatsService) {
              return StatsService.get({});
            }
          }
        }
      }
    });
}]);

statsApp.controller('StatsController', ['$scope', 'summary_stats', function ($scope, summary_stats) {
  $scope._dashboard_data = summary_stats;
  // console.log(summary_stats);
}]);