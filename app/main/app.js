/// <reference path="../../typings/all.d.ts" />
angular.module('mtg_commander_app', ['ui.router', 'autocomplete'])
    .controller('MainCtrl', function ($scope, $rootScope, $http) {
    // data used by / in smallSlider
    $scope.cardWidth = 223;
    $scope.cardHeight = 310;
    // when clicked on card in smallSlider
    $scope.selectCardVersion = function (card) {
        _.remove($scope.cardVersions, function (cardVersion) {
            return cardVersion.multiverseId !== card.multiverseId;
        });
        $scope.cardVersions[0].draggable = true;
    };
    // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions) {
        $scope.cardVersions = cardVersions;
    };
    // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.nextPileLabel = "";
    $scope.piles = [];
    $scope.createPile = function () {
        var newPile = {
            name: $scope.nextPileLabel
        };
        $scope.piles.push(newPile);
    };
    function onDrop(ev, data) {
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
});
// start the app
var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
};
angular.element(document).ready(function () {
    kickStart();
});
