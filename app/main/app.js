angular.module('mtg_commander_app', ['ui.router', 'autocomplete'])
  .controller('MainCtrl', function ($scope, $rootScope, $http) {

    // data used by / in smallSlider
    $scope.cardWidth = 223;
    $scope.cardHeight = 310;    
    
      // when clicked on card in smallSlider
    $scope.selectCardVersion = function (card) {      
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
      pile.className = "pile";
      pile.setAttribute("ondrop", drop);
      pile.setAttribute("ondragover", allowDrop)
      var table = document.getElementById("table");
      table.appendChild(pile);
    }

    function onDrop(event,data){
      debugger;
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
    }    

    // drag and drop: http://www.w3schools.com/html/html5_draganddrop.asp 

    function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
    }

    function allowDrop(ev) {
      ev.preventDefault();
    }

  })

// start the app
var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();
});


