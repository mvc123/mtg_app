/// <reference path="../../typings/all.d.ts" />

interface AppScope extends angular.IScope {
  deck: Deck,
  cardWidth: number;
  cardHeight: number;
  cardVersions: Card[];
  selectedCards: Card[]; // selected cards from smallslider are pushed into selectedCards array
  nextPileLabel: string;
  alldecks: Deck[]; // all decks current user created
  selectedDeck: { deck: Deck};
  selectCardVersion(card: Card): void; // when clicked on card in smallSlider
  createPile(): void;
  pileLength(pile: Pile): number;
  cbCardVersionsLoaded(cardVersions: Card[]): void;
  deleteCard(pile: Pile, card: Card): void; // delete card from deck and pile
  deleteSelectedCard(card: Card): void; // delete card from selectedCards
  deletePile(pile: Pile): void; // delete pile from deck
  changePileView(pile: Pile, view: string): void;
  getPileClass(pile: Pile): string;
  saveDeck(): void;
  deckSelected(): void;
  amountOfDifferentCards(deck: Deck): number; 
}

angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists', 'smallslider', 'constants', 'functions'])
  .controller('MainCtrl', function ($scope: AppScope, $rootScope, $http, serverLocation, amountOfDifferentCards) {

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
        cards: [],
        view: 'images'        
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

    $scope.changePileView = function (pile: Pile, view: string){      
      if(view === 'list'){
        pile.view = 'list';
      }
      if(view === 'images'){
        pile.view = 'images';
      }
    }

    $scope.getPileClass = function (pile: Pile){
      if(pile.view === "list"){
        return "listOfCards";
      }
      if(pile.view === "images"){
        return "pileOfCards";
      }
    }

    $scope.saveDeck = function (){      
      // let stringdeck = JSON.stringify($scope.deck);
      let deck = $scope.deck;      
      if(!$scope.deck.id){        
        console.log("test");
        // $http({ method: 'GET', url:'http://localhost:8006/cardnames'})
        $http({ method: 'POST', url: serverLocation + 'deck', data: deck}).then(function(result){ 
          console.log(result);
        });
      }
      if($scope.deck.id){
        $http({ method: 'PUT', url: serverLocation + 'deck', data: deck}).then(function(result){
          console.log(result);
        })
      }
    }
    function loadAllDecks (){
      $http({ method: 'GET', url: serverLocation + 'alldecks'}).then(function(alldecks){                         
        let parsedDecks = _.map(alldecks.data, function(deck){
          let parsedDeck = {
            id: deck.id,
            name: deck.name,
            piles: JSON.parse(deck.piles)
          }
          return parsedDeck;
        })
       
        $scope.alldecks = parsedDecks;        
      });
    }
    loadAllDecks();
    // drag and drop https://github.com/marceljuenemann/angular-drag-and-drop-lists
    $scope.selectedDeck = {deck: null};
    $scope.deckSelected = function (){
      debugger;
      $scope.deck = $scope.selectedDeck.deck      
    }

    $scope.amountOfDifferentCards = amountOfDifferentCards;  
      
    window.onbeforeunload = function (e) {
      return "Are you sure you want to navigate away from this page. Unsaved changes will be lost.";      
    };

    /*$scope.$on('$locationChangeStart', function(event, next, current) {
      if(!confirm("Are you sure you want to leave this page? Unsaved changes will be lost.")) {
          event.preventDefault();
      }
    });*/

  })

  // TO DO: set most recent deck active via localstorage
  // TO DO: on close window, navigate away: popup: save changes ? (refresh works)
  // TO DO: make function in service functions: amountOfDifferentCards in pile


// start the app
/*var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();  
});*/


