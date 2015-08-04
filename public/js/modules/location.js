var locations = angular.module('locations', []);

locations.controller('LocationController', ['$scope', 'LocationService', function ($scope, LocationService) {
  $scope._viewOptions = {
    page: 0,
    rpp: 20,
    listType: 'list_all_locations'
  };
  // return;
  LocationService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.places_list =  response;
  });

  $scope.submit_search = function submit_search (qry) {
    LocationService.query({
      listType: 'search',
      page: 0,
      rpp: 20,
      q: qry
    })
    .$promise
    .then(function (response) {
      $scope.places_list = response;
    });
  };

}]);
locations.controller('LocationPageController', ['$scope', 'LocationService', '$stateParams', function ($scope, LocationService, $stateParams) {
  $scope._viewOptions = {
    page: 0,
    rpp: 20,
    locationId: $stateParams.locationId,
    listType: 'activity'
  };
  // return;
  LocationService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.one_place_checkin =  response;
  });

}]);
locations.controller('FeedbackController', ['$scope', 'LocationService', '$stateParams', function ($scope, LocationService, $stateParams) {
  $scope._viewOptions = {
    page: 0,
    rpp: 20,
    locationId: $stateParams.locationId,
    listType: 'checkin'
  };
  // return;
  LocationService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.one_place_checkin =  response;
  });

}]);
locations.filter('author_field', function () {
  return function (ob) {
    if (_.isObject(ob)) {
      if (ob.email) {
        return ob.email;
      } else {
        return 'N/A';
      }
    } else {
      return 'N/A';
    }
  };
});