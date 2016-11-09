angular.module('mtg_commander_app', ['ui.router','autocomplete'])  
  .controller('MainCtrl', function($scope, $http){
      $scope.loadCard = function (){
        $scope.$broadcast('loadCard');
      }    
  });

  var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
  };
  
  angular.element(document).ready(function () { //Browser
    kickStart();
  });

  
  
  