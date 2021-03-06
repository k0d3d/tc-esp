var locations = angular.module('locations', []);

locations.controller('ActivitiesController', [
  '$scope',
  'FeedbackService',
  'api_config',
  function ($scope, FeedbackService, api_config) {
  $scope._viewOptions = {
    listType: 'feedbacks',
  };
  $scope.CDN_URL = api_config.CDN_URL;
  // return;
  FeedbackService.query($scope._viewOptions)
  .$promise
  .then(function (response) {
    $scope.all_feedback  =  response;
  }, function (err) {
    alert('An error occured when executing this operation. Admin has been notified');
  });


}])
.filter('shortenId', function () {
  return function (id) {
    if (id && id.length) {

      return id.substring(4, -1);
    } else {
      return '';
    }
  }
})
.filter('moment', function(){
  return function(time){
    if (time == 'Infinity') {
      return '--';
    } else {
      var m = moment(time);
      return m.fromNow();
    }
  };
});
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
    listType: 'list_all_locations'
    // entry_type: $stateParams.entry_type
  };


  // find locations that match this criteria.
  // extending the state params and the default
  // view options
  var opt = angular.extend({}, $scope._viewOptions, $stateParams);
  LocationService.query(opt)
  .$promise
  .then(function (response) {
    $scope.qry = _.omit($stateParams, ['rpp', 'listType', 'page', 'entry_type']);
    $scope.places_list =  response;
  });

  $scope.turnPage = function (qry) {

    var opt = angular.extend({}, $scope._viewOptions, qry.options, $stateParams);
    $state.transitionTo($state.current, opt, {
      reload: true, inherit: true, notify: true
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
    qry.search_query = [];
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

      qry['conditions.max_distance'] = 5;
    }

    if (!tag) {

      $state.transitionTo($state.current, angular.extend({}, $stateParams, qry), {
        reload: true, inherit: true, notify: true
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

    }

  };

}]);
locations.controller('LocationPageController', ['$scope', 'LocationService', '$stateParams', function ($scope, LocationService, $stateParams) {
  $scope._viewOptions = {
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

    }
    return {
      link: link,
      templateUrl: '/templates/pagination.jade',
      scope:{
        items:'=',
        'control': '='
      }
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