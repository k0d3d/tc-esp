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
locations.controller('LocationController', [
  '$scope',
  'LocationService',
  '$stateParams',
  '$state',
  'WardenService',
  '$q',
  function (
    $scope,
    LocationService,
    $stateParams,
    $state,
    warden,
    Q
    ) {
  $scope._viewOptions = {
    page: 0,
    rpp: 10,
    listType: 'list_all_locations',
    entry_type: $stateParams.entry_type
  };


  // find locations that match this criteria.
  // extending the state params and the default
  // view options
  var opt = angular.extend({}, $scope._viewOptions, $stateParams);
  LocationService.query(opt)
  .$promise
  .then(function (response) {
    $scope.qry = _.omit($stateParams, ['rpp', 'listType', 'page', 'entry_type'])
    $scope.places_list =  response;
  });

  $scope.turnPage = function (qry) {

    var opt = angular.extend({}, $scope._viewOptions, qry.options, $stateParams);
    $state.transitionTo($state.current, opt, {
      reload: true, inherit: false, notify: true
    });
    qry.callback();
    // LocationService.query(angular.extend({}, $scope._viewOptions, qry.options, $stateParams))
    // .$promise
    // .then(function (response) {
    //   //update our collection
    //   $scope.places_list =  response;
    //   //run this so the directive can handle success,
    //   //in this case, increment or decrement the currentPage
    //   //variable.
    // });
  };

  $scope.submit_search = function submit_search (qry, tag) {
    qry.is_search = true;
    //a collection with key as the field name.
    //and a hash specifying the operator to use
    //and the string or needle to be matched or
    //found.
    qry.search_query = [],
    qry.conditions = {};
    //set the author search definition
    if (qry.author) {
      qry.search_query.push({
        'author': {
          'operate':'equals',
          'value': qry.author
        }
      });
    }
    //set the category definition
    if (qry.category) {
      qry.search_query.push({
        'category': {
          'operate':'equals',
          'value': qry.category
        }
      });
    }
    //set the proxiity definition
    if (qry.lat && qry.lng) {
      // latitude: 6.5441483
      // longitude: 3.360115

      qry['conditions.max_distance'] = 1;
    }

    if (!tag) {

      $state.transitionTo($state.current, qry, {
        reload: true, inherit: false, notify: true
      });

    } else {
      var k = {};
      var placed_id = _.map($scope.places_list, function (m) {
        return {
          locationId: m._id,
          author: m.author,
          action: (m.authority && m.authority.length) ? 'modify-authority' : 'add-authority'
        };
      });
      if (qry.assign_to_user) {

        k.bulkAssignToUser = warden.bulkAssignToUser(placed_id, qry.assign_to_user);
      }
      // if (qry.assign_to_group) {
      //   k.bulkAssignToQGroup = warden.bulkAssignToQGroup(placed_id, qry.assign_to_group);
      // }
      Q.all(k)
      .then(function (all) {
        console.log(all);
      });
      // LocationService.query(angular.extend({}, qry, {
      //   listType: 'assign_locations_to_user',
      //   page: 0,
      //   rpp: 20,
      //   entry_type: qry.entry_type

      // }))
      // .$promise
      // .then(function (response) {
      //   $scope.places_list = response;
      // });
    }

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
        args.qry.options.page = targetPageNo;
        args.qry.options.rpp = limit;
        scope.pageTo(args);

        //   {pageNo: scope.pageno, limit: limit, cb: function(r){
        //   if(r) scope.limit = limit; q`123456832
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