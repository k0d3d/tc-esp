var locations = angular.module('locations', []);
locations.controller('ActivitiesController', ['$scope', 'FeedbackService', function ($scope, FeedbackService) {
  $scope._viewOptions = {
    page: 0,
    rpp: 10,
    listType: 'feedbacks',
  };
  // return;
  FeedbackService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.all_feedback  =  response;
  }, function (err) {
    alert('An error occured when executing this operation. Admin has been notified');
  });
}]);
locations.controller('LocationController', ['$scope', 'LocationService', function ($scope, LocationService) {
  $scope._viewOptions = {
    page: 0,
    rpp: 10,
    listType: 'list_all_locations'
  };
  // return;
  LocationService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.places_list =  response;
  });

  $scope.turnPage = function (qry) {
    LocationService.query(angular.extend({}, $scope._viewOptions, qry.options))
    .$promise
    .then(function (response) {
      //update our collection
      $scope.places_list =  response;
      //run this so the directive can handle success,
      //in this case, increment or decrement the currentPage
      //variable.
      qry.callback(response);
    });
  };

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
    listType: 'checkin',
    cid: $stateParams.checkinId
  };
  // return;
  LocationService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.one_checkin_feedback  =  response;
  }, function (err) {
    alert('An error occured when executing this operation. Admin has been notified');
  });

}]);
locations.directive('pagination', [function(){
    function link(scope, element, attrs){
      scope.pageno = 0;
      scope.limit = 10;
      var currentPage = 0,
          targetPageNo = 0;
      var args = {
        qry:{
          options: {},
          callback: function(r){
            // are we going to the next page?
            if(targetPageNo > currentPage) {
              currentPage++;
            } else
            //are we heading to the previous page?
            if (targetPageNo < currentPage) {
              currentPage--;
            }
            scope.currentPage = currentPage;
          }
        }
      };

      $('button.prevbtn', element).on('click', function(e){
        if(currentPage <= 0) return false;
        targetPageNo = currentPage - 1;
        args.qry.options.page = targetPageNo;
        args.qry.options.rpp = scope.limit;
        scope.pageTo(args);
      });
      $('button.nextbtn', element).on('click', function(e){
        targetPageNo = currentPage + 1;
        args.qry.options.page = targetPageNo;
        args.qry.options.rpp = scope.limit;
        scope.pageTo(args);
      });

      scope.pagelimit = function(limit){
        scope.pageTo(args);
        //   {pageNo: scope.pageno, limit: limit, cb: function(r){
        //   if(r) scope.limit = limit;
        // }});
      };
    }
    return {
      link: link,
      scope: {
        pageTo: '&'
      },
      templateUrl: '/templates/pagination.jade'
    };
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