angular.module('mtg_commander_app', ['ui.router', 'autocomplete'])
  .controller('MainCtrl', function ($scope, $rootScope, $http) {

    // data used by / in smallSlider
    $scope.cardWidth = 223;
    $scope.cardHeight = 310;    
    
      // when clicked on card in smallSlider
    $scope.selectCardVersion = function (card) {
      debugger;
      _.remove($scope.cardVersions, function (cardVersion) {
        return cardVersion.multiverseId !== card.multiverseId;
      })
      $scope.cardVersions[0].draggable = true;
    }
      // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions){
      $scope.cardVersions = cardVersions
    }

      // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.pileLabel = "";
    $scope.createPile = function ($event) {
      // console.log($scope.pileLabel);
      var pile = document.createElement("p");
      var title = document.createTextNode($scope.pileLabel);
      pile.appendChild(title);
      pile.className = "pile"
      var table = document.getElementById("table");
      table.appendChild(pile);
    }
    // drag and drop: http://www.w3schools.com/html/html5_draganddrop.asp 
  })

// start the app
var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();
});


