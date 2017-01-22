angular.module('mtg_commander_app', ['ui.router', 'autocomplete'])
  .controller('MainCtrl', function ($scope, $rootScope, $http) {

    // data used by / in smallSlider
    $scope.cardWidth = 223;
    $scope.cardHeight = 310;    
    // emitted by the autocomplete when cardVersions are loaded, cardVersions are passed to smallSlider
    $rootScope.$on('cardVersions', function (event, cardVersions) {                  
      $scope.cardVersions = cardVersions;
      $scope.selectCardVersion = function (card) {
        debugger;
        _.remove($scope.cardVersions, function (cardVersion) {
          return cardVersion.multiverseId !== card.multiverseId;
        })
        $scope.cardVersions[0].draggable = true;
      }      
    })

    $scope.pileLabel = "";
    $scope.createPile = function ($event) {
      // console.log($scope.pileLabel);
      var pile = document.createElement("p");
      var title = document.createTextNode($scope.pileLabel);
      pile.appendChild(title);

      var table = document.getElementById("table");
      table.appendChild(pile);
    }
  })

// start the app
var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();
});


