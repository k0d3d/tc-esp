var users = angular.module('users', []);

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

  $scope.update_user = function update_user (data) {
    var user = new UserService();
    for (var q in data) {
      user[q] = data[q];
    }
    user.$update();
  };

  $scope.add_new_user = function add_new_user (data) {
    var user = new UserService();
    for (var q in data) {
      user[q] = data[q];
    }
    user.$save();
  };

  $scope.manageUser = function (user) {
    $scope.isInView = user;
  };

}]);
