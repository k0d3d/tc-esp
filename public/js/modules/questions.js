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
  function ($scope, questions_overview, QtnService) {
  $scope.__data = questions_overview;

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

  // console.log(summary_stats);
}]);