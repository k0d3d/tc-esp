var qtnApp = angular.module('tc.questions.ng', []);

qtnApp.config([
  '$stateProvider',
  function ($stateProvider){
    $stateProvider
    .state('questions', {
      url: '/qtn',
      views: {
        'pageContent' : {
          templateUrl: '/questions/index',
          controller: 'QtnController',
          resolve: {
            'questions_overview': function (QtnService) {
              return QtnService.query({});
            }
          }
        }
      }
    });
}]);

qtnApp.controller('QtnController', [
  '$scope',
  'questions_overview',
  'QtnService',
  'WardenService',
  function (
    $scope,
    questions_overview,
    QtnService,
    Warden
  ) {
  $scope.__data = questions_overview;

  $scope.modify_assignments =  function (locationList, qry, group) {
    if (qry.assign_to_group) {
      Warden.bulkAssignToQGroup(locationList, group)
      .then(function () {
        alert('Changes have been made to location group property');
      }, function (err) {
        console.log(err);
        alert('An error occured while making changes,');
      });

    }
    if (qry.assign_to_user) {
      Warden.bulkAssignToUser(locationList, group)
      .then(function () {
        alert('Changes have been made to Location access.');
      }, function (err) {
        console.log(err);
        alert('An error occured while making changes,');
      });

    }
  }

  $scope.save_question = function save_question (form) {
    var line_of = [];

    if (form.questions && form.questions.length) {
      line_of = form.questions.split('\n');
    }

    var q  = new QtnService();
    q.questions = line_of;
    q.response_type = form.response_type;
    q.email_assignee = form.email_assignee;
    q.promptAfter = form.promptAfter;
    q.$save();

  };

  $scope.trash_question = function trash_question (doc) {
    // var d = QtnService[index];
    // d.$delete();
    QtnService.remove({
      'question_id' : doc._id
    }, function (e) {
      console.log(e);
    });
  };

  // console.log(summary_stats);
}]);