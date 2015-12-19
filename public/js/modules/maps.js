var MapApp = angular.module('GoogleMapsInitializer', []);


MapApp.factory('Initializer', function($window, $q){
    //Google's url for async maps initialization accepting callback function
    var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCOt9IYHpYN22m7alw_HKi5y5WBgu57p4s&v=3.exp&sensor=true&callback=googleMapsInitialized',
        mapsDefer = $q.defer();

    function init () {
            var gMapsLoader = $.getScript(asyncUrl);
            gMapsLoader.done(function () {

            })
            .fail(function (err) {
              return mapsDefer.reject(err);
            });

        //Callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = mapsDefer.resolve;

    }

    init();

    //Usage: Initializer.mapsInitialized.then(callback)
    return {
        mapsInitialized : mapsDefer.promise,
        reload: init
    };
});


// formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
MapApp.filter('lat', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ns = input > 0 ? "N" : "S";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ns;
    };
});

// formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
MapApp.filter('lon', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ew = input > 0 ? "E" : "W";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ew;
    };
});


MapApp.directive("cityState", ['Initializer', 'gpService', function (Initializer, gp) {
  return {
    template: '<em>{{locationData.formatted_address}}</em>',
    scope: {
      locationData: "=cityState"
    },
    link: function (scope) {
      Initializer.mapsInitialized
      .then(function () {
        // scope.locationData should contain lat/log properties eg. {lat: 6.323223, lng: 1.03323}
        gp.addGPQuery(scope.locationData)
        .then(function (results) {

              var result = results.results[0];

              scope.locationData.formatted_address = result.formatted_address;
              // scope.$apply();
        });


        scope.$watch('locationData', function (n) {
            if (n) {
                // init();
            }
        });

      });
    }
  };
}]);

MapApp.service('gpService', ['$http', '$q', function ($http, $q) {
  var queueLocationData = [];
  var lookUpGp = function lookUpGp (locationData) {
    // still using promises
    var deferred = $q.defer();

    var latLng = new google.maps.LatLng(locationData.latitude, locationData.longitude),
      geoCoder = new google.maps.Geocoder();

      geoCoder.geocode({
        "latLng": latLng
      }, function (results, status) {

        //store in a variable
        locationData.results = results;
        deferred.resolve(locationData);
    });

    return deferred.promise;
  };
  return {
    isQuerying: false,
    addGPQuery: function (sd) {
      var d = $q.defer();
      //adds argument 'sd',
      //adds a function with sd as arguments and
      sd.$Promise = d;
      queueLocationData.push(sd);
      if (!this.isQuerying) {
        this.isQuerying = true;
        this.execGPQuery();
      }
      return sd.$Promise.promise;

    },
    // This will loop through the queueLocationData array,
    // The pop() method removes the last element from an
    // array and returns that element.
    execGPQuery: function execGPQuery () {
      var self = this;

      if (queueLocationData.length) {
        // 'cl' should contain
        // {
        //
        // }
        var cl = queueLocationData.shift();

        // this function uses the google places
        // reverse geocoding api to fetch an address based
        // on the values of cl.lat and cl.lng. it returns a
        // promise.
        lookUpGp(cl)
        .then(function (liv) {
          console.log('fiii');
          cl.$Promise.resolve(liv);
          if (queueLocationData.length) {
            setTimeout(function () {
              self.execGPQuery();
            }, 2500);
            // self.execGPQuery();
          } else {
            self.isQuerying = false;
          }
        });

      } else {
        self.isQuerying = false;
      }
    }
  };
}]);

/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
MapApp.directive("appMap", [
    '$window',
    '$timeout',
    'Initializer',
    '$interval',
    'locationsService',
    '$q',
    '$state',
    '$rootScope',
    function ($window, $timeout, Initializer, $interval, locationsService, Q, $state, $rootScope) {
    return {
        transclude: 'element',
        restrict: "E",
        replace: true,
        templateUrl: "templates/inc/maps-holder.html",
        scope: {
            // center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            // width: "@",         // Map width in pixels.
            // height: "@",        // Map height in pixels.
            // mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            // panControl: "@",    // Whether to show a pan control on the map.
            // zoomControl: "@",   // Whether to show a zoom control on the map.
            // scaleControl: "@"   // Whether to show scale control on the map.
            isLoadingGmaps: "=isGmapsLoaded",
            errorLoadingGmaps: "="
        },
        controller: 'HomeCtrl',
        link: function (scope, element, attr, ctrl, transclude) {
            scope.center = {};
            scope.isLoadingGmaps = true;
            var currentMarkers = [], mapEle;

            scope.createMap = function createMap() {
              var q = Q.defer();

              Initializer.mapsInitialized
              .then(function(){
                  var myLatLng = new google.maps.LatLng(scope.center.lat, scope.center.lon);
                  var mapOptions = {
                    zoom: 17,
                    center: myLatLng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: true,
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    navigationControl: true,
                    disableDefaultUI: true,
                    overviewMapControl: true
                  };
                  scope.map = new google.maps.Map(element[0], mapOptions);
                  scope.myLocation = new google.maps.Marker({
                      position: myLatLng,
                      map: scope.map,
                      title: 'My Location',
                      icon: 'img/u-marker.png'
                  });

                  google.maps.event.addDomListener($('div.map-container'), 'mousedown', function(e) {
                    e.preventDefault();
                    return false;
                  });
                  var infowindow = new google.maps.InfoWindow({
                    content: '<button class="button button-positive open-tag-dialog-btn button-clear button-small" ng-click="tagPopOver()">You are here</button>'
                  });

                  infowindow.open(scope.map, scope.myLocation);

                  scope.isLoadingGmaps = false;
                  scope.errorLoadingGmaps = false;

                  $(document).on('click', '.open-tag-dialog-btn', function(e) {
                    scope.tagPopOver();
                  });
                  q.resolve();
              }, function (err) {
                scope.errorLoadingGmaps = true;
              });
              return q.promise;
            };

            var mapLoader = function () {
              if (mapEle) {
                mapEle.remove();
                mapEle = null;
              }
              transclude(function (clone) {
                element.parent().append(clone);
                mapEle = clone;
                scope.createMap();
                //load user added / tagged / check-in locations / or load locations wit the users interest
                locationsService.locationProximity({
                  loadPerRequest: 20
                })
                .then(function(d) {
                  scope.markers = d.data;
                  updateMarkers();
                }, function (err) {
                  if (err instanceof Error) {
                     if (err.message === 'NoLocationData') {
                        // alert('Location not found');
                     }
                  }
                  // alert('other error occured');
                  scope.$broadcast('scroll.refreshComplete');
                  console.log(err);
                });
              });
            };


            function refreshMeMarker () {
              if (scope.myLocation) {
                scope.myLocation.setMap( scope.map );
                //delayed so you can see it move
                var resetMapMarker = $timeout( function(){
                    // console.log("na here sure pass");
                    scope.myLocation.setPosition( new google.maps.LatLng(scope.center.lat, scope.center.lon) );
                    // scope.map.panTo( new google.maps.LatLng( scope.center.lat, scope.center.lon ) );

                }, 1500 );
                scope.$on('$destroy', function () {
                  resetMapMarker.cancel();
                });
              }
            }

            var mapRefresh = $interval(function () {
                    scope.center.lat = locationsService.getMyLocation().latitude;
                    scope.center.lon = locationsService.getMyLocation().longitude;
                    // refreshMeMarker();
            }, 10000);

            // angular.element(document).ready(createMap());
            // var mapRefresh = scope.$watch(locationsService.getMyLocation,
            //     function (coords, oldValue) {
            //         console.log('coords');
            //         // console.log(oldValue);
            //     }

            // );


            $rootScope.$on('appEvent::reloadMap', mapLoader);

            scope.$on('$destroy', function () {
              mapRefresh.cancel();
            });

            var i = locationsService.geoLocationInit();
            i.then(
                function(position) {
                    scope.center.lat = locationsService.getMyLocation().latitude;
                    scope.center.lon = locationsService.getMyLocation().longitude;
                    scope.createMap()
                    .then(function (){
                      //load user added / tagged / check-in locations / or load locations wit the users interest
                      locationsService.locationProximity({
                        loadPerRequest: 20
                      })
                      .then(function(d) {
                        scope.markers = d.data;
                        updateMarkers();
                      }, function (err) {
                        if (err instanceof Error) {
                           if (err.message === 'NoLocationData') {
                              // alert('Location not found');
                           }
                        }
                        // alert('other error occured');
                        scope.$broadcast('scroll.refreshComplete');
                        console.log(err);
                      });
                    });
                },
                function(e) {
                  scope.errorLoadingGmaps = true;
                  console.log("Error retrieving position " + e.code + " " + e.message);
                }
            );

            function updateMarkers() {
              if (scope.map) {
                for (var i = 0; i < scope.markers.length; i++) {
                  var m = scope.markers[i];

                  var loc = new google.maps.LatLng(m.latitude, m.longitude);

                  var mm = new google.maps.Marker({
                    position: loc,
                    map: scope.map,
                    icon: 'img/icon-marker.png',
                    title: m.name
                  });

                  // var infowindow = new google.maps.InfoWindow({
                  //   content: '<button class="button button-positive button-clear button-small">'+ m.name +'</button>'
                  // });

                  // $(document).on('click', mm, function(e) {
                  //   infowindow.open(scope.map, mm);
                  // });

                  //console.log("map: make marker for " + m.name);
                  // google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
                  currentMarkers.push(mm);
                  }
                }
              }


            // Info window trigger function
            // function onItemClick(pin, label, datum, url) {
            //   // Create content
            //   var contentString = "Name: " + label + "<br />Time: " + datum;
            //   // Replace our Info Window's content and position
            //   infowindow.setContent(contentString);
            //   infowindow.setPosition(pin.position);
            //   infowindow.open(map);
            //   google.maps.event.addListener(infowindow, 'closeclick', function() {
            //     //console.log("map: info windows close listener triggered ");
            //     infowindow.close();
            //     });
            // }

            // function markerCb(marker, member, location) {
            //     return function() {
            //     //console.log("map: marker listener for " + member.name);
            //     var href="http://maps.apple.com/?q="+member.lat+","+member.lon;
            //     map.setCenter(location);
            //     onItemClick(marker, member.name, member.date, href);
            //     };
            //   }

            // update map markers to match scope marker collection
            // function updateMarkers() {
            //   if (scope.map) {
            //     // create new markers
            //     //console.log("map: make markers ");
            //     currentMarkers = [];
            //     // var markers = scope.markers;
            //     // if (angular.isString(markers)){
            //     //   markers = scope.$eval(scope.markers);
            //     // }
            //     for (var i = 0; i < scope.markers.length; i++) {
            //       var m = scope.markers[i];

            //       var loc = new google.maps.LatLng(m.lat, m.lon);

            //       var mm = new google.maps.Marker({
            //         position: loc,
            //         map: map,
            //         title: m.name
            //       });
            //       //console.log("map: make marker for " + m.name);
            //       google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
            //       currentMarkers.push(mm);
            //       }
            //     }
            //   }

            // convert current location to Google maps location
            // function getLocation(loc) {
            //   if (loc == null) return new google.maps.LatLng(40, -73);
            //   if (angular.isString(loc)) loc = scope.$eval(loc);
            //   return new google.maps.LatLng(loc.lat, loc.lon);
            //   }

      } // end of link:
    }; // end of return
}]);
