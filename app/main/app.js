/// <reference path="../../typings/all.d.ts" />
angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists', 'smallslider', 'constants', 'functions', 'services'])
    .controller('MainCtrl', function ($scope, $rootScope, $http, serverLocation, amountOfDifferentCards, $timeout, confirmationpopup) {
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
            cards: [],
            view: 'images'
        };
        $scope.deck.piles.push(newPile);
    };
    $scope.hideAllPiles = function () {
        $scope.hiddenPiles = [];
        _.forEach($scope.deck.piles, function (pile) {
            $scope.hiddenPiles.push(pile);
        });
    };
    $scope.showAllPiles = function () {
        $scope.hiddenPiles = [];
    };
    $scope.pileLength = function (pile) {
        return pile.cards.length;
    };
    $scope.deleteCard = function (targetpile, targetcard) {
        var indexpile = _.findIndex($scope.deck.piles, function (pile) {
            return pile.name === targetpile.name;
        });
        _.remove($scope.deck.piles[indexpile].cards, function (card) {
            return card.name === targetcard.name;
        });
    };
    $scope.hiddenPiles = localStorage.getItem("hiddenPiles") ? JSON.parse(localStorage.getItem("hiddenPiles")) : [];
    $scope.togglePile = function (pile) {
        var hiddenPile = _.find($scope.hiddenPiles, function (p) {
            return p.name === pile.name;
        });
        if (hiddenPile) {
            _.pull($scope.hiddenPiles, hiddenPile);
        }
        if (!hiddenPile) {
            $scope.hiddenPiles.push(pile);
        }
    };
    $scope.showPile = function (pile) {
        if ($scope.hiddenPiles.length === 0) {
            return true;
        }
        var hiddenPile = _.find($scope.hiddenPiles, function (p) {
            return p.name === pile.name;
        });
        if (hiddenPile) {
            return false;
        }
        if (!hiddenPile) {
            return true;
        }
    };
    $scope.deleteSelectedCard = function (targetcard) {
        _.remove($scope.selectedCards, function (card) {
            return card.name === targetcard.name;
        });
    };
    $scope.deletePile = function (targetpile, $event) {
        debugger;
        confirmationpopup.show($event);
        /*_.remove($scope.deck.piles, function(pile){
          return pile.name === targetpile.name;
        })*/
    };
    $scope.changePileView = function (pile, view) {
        if (view === 'list') {
            pile.view = 'list';
        }
        if (view === 'images') {
            pile.view = 'images';
        }
    };
    $scope.getPileClass = function (pile) {
        if (pile.view === "list") {
            return "listOfCards";
        }
        if (pile.view === "images") {
            return "pileOfCards";
        }
    };
    $scope.showSavePopup = false;
    $scope.saveDeck = function () {
        // let stringdeck = JSON.stringify($scope.deck);
        var deck = $scope.deck;
        if (!$scope.deck.id) {
            console.log("test");
            // $http({ method: 'GET', url:'http://localhost:8006/cardnames'})
            $http({ method: 'POST', url: serverLocation + 'deck', data: deck }).then(function (result) {
                $scope.showSavePopup = true;
                $timeout(function () {
                    $scope.showSavePopup = false;
                }, 2000);
            }, function () {
                alert("Saven mislukt.");
            });
        }
        if ($scope.deck.id) {
            $http({ method: 'PUT', url: serverLocation + 'deck', data: deck }).then(function (result) {
                debugger;
                $scope.showSavePopup = true;
                $timeout(function () {
                    $scope.showSavePopup = false;
                }, 2000);
            }, function () {
                alert("Saven mislukt.");
            });
        }
    };
    function loadAllDecks() {
        $http({ method: 'GET', url: serverLocation + 'alldecks' }).then(function (alldecks) {
            var parsedDecks = _.map(alldecks.data, function (deck) {
                var parsedDeck = {
                    id: deck.id,
                    name: deck.name,
                    piles: JSON.parse(deck.piles)
                };
                return parsedDeck;
            });
            $scope.alldecks = parsedDecks;
            var latestActiveDeckName = localStorage.getItem("latestActiveDeck");
            if (latestActiveDeckName) {
                var latestActiveDeck = _.find($scope.alldecks, function (deck) {
                    return deck.name === latestActiveDeckName;
                });
                if (latestActiveDeck) {
                    $scope.deck = latestActiveDeck;
                }
            }
        });
    }
    loadAllDecks();
    // drag and drop https://github.com/marceljuenemann/angular-drag-and-drop-lists
    $scope.selectedDeck = { deck: null };
    $scope.deckSelected = function () {
        debugger;
        $scope.deck = $scope.selectedDeck.deck;
    };
    $scope.amountOfDifferentCards = amountOfDifferentCards;
    window.onbeforeunload = function (e) {
        if ($scope.deck && $scope.deck.name) {
            localStorage.setItem('latestActiveDeck', $scope.deck.name);
            localStorage.setItem('hiddenPiles', JSON.stringify($scope.hiddenPiles));
        }
        return "Are you sure you want to navigate away from this page. Unsaved changes will be lost.";
    };
});
// TO DO: make function in service functions: amountOfDifferentCards in pile
// start the app
/*var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();
});*/
