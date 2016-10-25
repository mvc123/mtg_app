angular.module('mtg_commander_app', ['ui.router','autocomplete'])  
  .controller('MainCtrl', function($scope, $http){
      $scope.sayHello = function (){
        alert("Hello");
        console.log('Hello');
      }
      console.log("Hallo");
      $scope.loadCards = function () {      
        var allCards = $http({ method: 'GET', url:'http://localhost:8006/cardnames'}).then(function(response){
          
        });
      }    
  });

  var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
  };
  
  angular.element(document).ready(function () { //Browser
    kickStart();
  });

  
  
  