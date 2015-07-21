var users = angular.module('users', []);
users.controller('authentication', ['$scope', 'requests', function ($scope, requests) {
  $scope.do_logout = function do_logout () {
    requests.logout();
  };
}]);
users.controller('UserController', ['$scope', 'UserService', function ($scope, UserService) {
  $scope._viewOptions = {
    page: 0,
    rpp: 20
  };

  $scope.users_list = [];
  UserService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.users_list =  response;
  });

  $scope.manageUser = function (user) {
    $scope.isInView = user;
  };

}]);
