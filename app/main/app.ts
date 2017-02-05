/// <reference path="../../typings/all.d.ts" />

interface Deck {
  id: number;
  name: string;
  piles: Pile[];
}

interface Pile {
  name: string;
  cards: Card[];  
}

interface Card { 
  cmc: number;
  colorIdentity: string; // example "R"
  colors: string; // "Red"
  imageName: string; // "fork"
  manacost: string; //"{R}{R}"
  multiverseId: number; // 200
  name: string;  // "Fork"
  power: number;
  subtypes: string;
  text: string; // "Copy target instant or sorcery spell, except that the copy is red. You may choose new targets for the copy."
  toughness: number;
  type: string; // "Instant"
  types: string; //"Instant"
}

interface AppScope extends angular.IScope {
  deck: Deck,
  cardWidth: number;
  cardHeight: number;
  cardVersions: Card[];
  selectedCards: Card[]; // selected cards from smallslider are pushed into selectedCards array
  nextPileLabel: string;
  selectCardVersion(card: Card): void; // when clicked on card in smallSlider
  createPile(): void;
  pileLength(pile: Pile): number;
  cbCardVersionsLoaded(cardVersions: Card[]): void;
  deleteCard(pile: Pile, card: Card): void; // delete card from deck and pile
  deleteSelectedCard(card: Card): void; // delete card from selectedCards
  deletePile(pile: Pile): void; // delete pile from deck
  saveDeck(): void;
}

angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists'])
  .controller('MainCtrl', function ($scope: AppScope, $rootScope, $http) {

    // data used by / in smallSlider
    $scope.cardWidth = 168;
    $scope.cardHeight = 247;    
          
    $scope.selectCardVersion = function (card) {                 
      $scope.selectedCards.push(card);
      $scope.cardVersions = [];      
    }
      
    $scope.selectedCards = [];

    // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions){
      $scope.cardVersions = cardVersions
    }

      // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.deck = {
      name: "",
      piles: [],
      id: null
    }

    $scope.nextPileLabel = "";    
    $scope.createPile = function (){
      // create check to make sure no two piles have same name
      let newPile = {
        name: $scope.nextPileLabel,
        // cards: [{name: "Lightning Bolt"}, {name:"Giant Growth"}, {name:"Mystical Tutor"}]
        cards: []        
      }
      $scope.deck.piles.push(newPile);
    }
    $scope.pileLength = function (pile: Pile){
      return pile.cards.length;
    }
    $scope.deleteCard = function (targetpile, targetcard){
      debugger;
      let indexpile = _.findIndex($scope.deck.piles, function(pile){
        return pile.name === targetpile.name;
      })
      _.remove($scope.deck.piles[indexpile].cards, function (card){
        return card.name === targetcard.name;
      })
    }

    $scope.deleteSelectedCard = function (targetcard: Card){
      _.remove($scope.selectedCards, function(card){
        return card.name === targetcard.name;
      })
    }

    $scope.deletePile = function (targetpile: Pile){
      _.remove($scope.deck.piles, function(pile){
        return pile.name === targetpile.name;
      })
    }

    $scope.saveDeck = function (){      
      // let stringdeck = JSON.stringify($scope.deck);
      let stringdeck = $scope.deck;
      if(!$scope.deck.id){
        // $http({ method: 'GET', url:'http://localhost:8006/cardnames'})
        $http({ method: 'POST', url: 'http://localhost:8006/deck', data: stringdeck}).then(function(result){ console.log(result)});
      }
      /*if($scope.deck.id){
        $http({ method: 'PUT', url: 'http://localhost:8006/deck'})
      }*/
    }
    // drag and drop https://github.com/marceljuenemann/angular-drag-and-drop-lists        
  })

// start the app
var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();
});


