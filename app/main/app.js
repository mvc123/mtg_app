/// <reference path="../../typings/all.d.ts" />
angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists'])
    .controller('MainCtrl', function ($scope, $rootScope, $http) {
    // data used by / in smallSlider
    $scope.cardWidth = 168;
    $scope.cardHeight = 247;
    $scope.selectCardVersion = function (card) {
        $scope.selectedCards.push(card);
        $scope.cardVersions = [];
    };
    $scope.selectedCards = [];
    // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions) {
        $scope.cardVersions = cardVersions;
    };
    // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.deck = {
        name: "",
        piles: [],
        id: null
    };
    $scope.nextPileLabel = "";
    $scope.createPile = function () {
        // create check to make sure no two piles have same name
        var newPile = {
            name: $scope.nextPileLabel,
            // cards: [{name: "Lightning Bolt"}, {name:"Giant Growth"}, {name:"Mystical Tutor"}]
            cards: []
        };
        $scope.deck.piles.push(newPile);
    };
    $scope.pileLength = function (pile) {
        return pile.cards.length;
    };
    $scope.deleteCard = function (targetpile, targetcard) {
        debugger;
        var indexpile = _.findIndex($scope.deck.piles, function (pile) {
            return pile.name === targetpile.name;
        });
        _.remove($scope.deck.piles[indexpile].cards, function (card) {
            return card.name === targetcard.name;
        });
    };
    $scope.deleteSelectedCard = function (targetcard) {
        _.remove($scope.selectedCards, function (card) {
            return card.name === targetcard.name;
        });
    };
    $scope.deletePile = function (targetpile) {
        _.remove($scope.deck.piles, function (pile) {
            return pile.name === targetpile.name;
        });
    };
    $scope.saveDeck = function () {
        // let stringdeck = JSON.stringify($scope.deck);
        var stringdeck = $scope.deck;
        if (!$scope.deck.id) {
            // $http({ method: 'GET', url:'http://localhost:8006/cardnames'})
            $http({ method: 'POST', url: 'http://localhost:8006/deck', data: stringdeck }).then(function (result) { console.log(result); });
        }
        /*if($scope.deck.id){
          $http({ method: 'PUT', url: 'http://localhost:8006/deck'})
        }*/
    };
    function loadAllDecks() {
        $http({ method: 'GET', url: 'http://localhost:8006/alldecks' }).then(function (alldecks) {
            debugger;
            var parsedDecks = _.map(alldecks.data, function (deck) {
                var parsedDeck = {
                    id: deck.id,
                    name: deck.name,
                    piles: JSON.parse(deck.piles)
                };
                return parsedDeck;
            });
            $scope.alldecks = parsedDecks;
        });
    }
    loadAllDecks();
    // drag and drop https://github.com/marceljuenemann/angular-drag-and-drop-lists
    $scope.selectedDeck = { deck: null };
    $scope.deckSelected = function () {
        debugger;
        $scope.deck = $scope.selectedDeck.deck;
        $scope.$digest();
    };
});
// start the app
var kickStart = function () {
    angular.bootstrap(document, ['mtg_commander_app']);
};
angular.element(document).ready(function () {
    kickStart();
});
