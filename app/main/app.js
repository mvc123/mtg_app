angular.module('mtg_commander_app', ['ui.router','autocomplete'])  
  .controller('MainCtrl', function($scope, $rootScope, $http){
   //  $scope.cardVersions = []; //dit werkt niet in combinatie met autocomplete.js
    $scope.selectCardVersion = function (card){
      _.remove($rootScope.cardVersions, function(cardVersion){
        return cardVersion.multiverseId !== card.multiverseId;
      })
    }          
  });

  var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
  };
  
  angular.element(document).ready(function () { //Browser
    kickStart();
  });
  
  
  