/// <reference path="../../typings/all.d.ts" />
angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists'])
    .controller('MainCtrl', function ($scope, $rootScope, $http) {
    // data used by / in smallSlider
    $scope.cardWidth = 223;
    $scope.cardHeight = 310;
    // when clicked on card in smallSlider
    $scope.selectCardVersion = function (card) {
        $scope.selectedCards.push(card);
        $scope.cardVersions = [];
    };
    // selected cards from smallslider are pushed into selectedCards array
    $scope.selectedCards = [];
    // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions) {
        $scope.cardVersions = cardVersions;
    };
    // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.nextPileLabel = "";
    $scope.piles = [];
    $scope.createPile = function () {
        var newPile = {
            name: $scope.nextPileLabel,
            cards: [{ name: "Lightning Bolt" }, { name: "Giant Growth" }, { name: "Mystical Tutor" }]
        };
        $scope.piles.push(newPile);
    };
    $scope.piles = [{ name: "creatures", cards: [{ name: "Llanowar Elves" }, { name: "Force of Nature" }, { name: "Jenara, Azusa of War" }] },
        { name: "artifacts", cards: [{ name: "Mindstone" }, { name: "Sol Ring" }, { name: "Icy Manipulator" }] }];
    // drag and drop https://github.com/marceljuenemann/angular-drag-and-drop-lists
    // illegal drops: items is removed from original pile and not added to other pile
    $scope.draggedcard = {};
});
// start the app
var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
};
angular.element(document).ready(function () {
    kickStart();
});
