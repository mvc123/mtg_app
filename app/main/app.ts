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
  hiddenPiles: Pile[];
  showSavePopup: boolean;
  togglePile(pile): void; 
  showPile(pile): boolean;
  selectCardVersion(card: Card): void; // when clicked on card in smallSlider
  createPile(): void;
  pileLength(pile: Pile): number;
  cbCardVersionsLoaded(cardVersions: Card[]): void;
  deleteCard(pile: Pile, card: Card): void; // delete card from deck and pile
  deleteSelectedCard(card: Card): void; // delete card from selectedCards
  deletePile(pile: Pile, event): void; // delete pile from deck
  hideAllPiles(): void;
  showAllPiles(): void;
  changePileView(pile: Pile, view: string): void;
  getPileClass(pile: Pile): string;
  saveDeck(action: string): void;
  deckSelected(): void;
  amountOfDifferentCards(deck: Deck): number; 
}

angular.module('mtg_commander_app', ['ui.router', 'autocomplete', 'dndLists', 'smallslider', 'constants', 'functions', 'services', 'links', 'counters'])
  .controller('MainCtrl', function ($scope: AppScope, $rootScope, $http, serverLocation, amountOfDifferentCards, 
                                    $timeout, popup, confirmationpopup, proxypopup) {
    
    // data used by / in smallSlider
    $scope.cardWidth = 168;
    $scope.cardHeight = 240;    
          
    $scope.selectCardVersion = function (card) {    
      $scope.selectedCards.push(card);
      $scope.cardVersions = [];      
    }
    
    $scope.createProxy = function(){
        debugger;        
        let options = {                       
            scope: $scope
        }
        debugger;
        proxypopup.show(options).then(function(proxy){
            $scope.selectedCards.push(proxy);
        }, function(cancel){
            return;
        });        
    }
    
    $scope.selectedCards = [];

    // called in autocomplete.js when cardVersions are loaded
    $scope.cbCardVersionsLoaded = function (cardVersions){
      $scope.cardVersions = cardVersions
    }

    $scope.createNewDeck = function (){
      $scope.deck = {
        name: "",
        piles: [],
        id: null
      }
    }

      // used to create piles (collections / verzamelingen) on the table (div with id table)
    $scope.deck = {
      name: "",
      piles: [],
      id: null
    }

    $scope.showPopup = function(content){
      let options = {
        scope: $scope,
        title: "Dit is de titel",
        content: content
      }
      popup.show(options);
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
    $scope.hideAllPiles = function (){
      $scope.hiddenPiles = [];
      _.forEach($scope.deck.piles, function (pile){
        $scope.hiddenPiles.push(pile);
      });
    };
    $scope.showAllPiles = function (){
      $scope.hiddenPiles = [];
    };

    $scope.pileLength = function (pile: Pile){
      return pile.cards.length;
    }
    $scope.deleteCard = function (targetpile, targetcard){
      let indexpile = _.findIndex($scope.deck.piles, function(pile){
        return pile.name === targetpile.name;
      })
      _.remove($scope.deck.piles[indexpile].cards, function (card){
        return card.name === targetcard.name;
      })
    }

    $scope.hiddenPiles = localStorage.getItem("hiddenPiles") ? JSON.parse(localStorage.getItem("hiddenPiles")) : [];
    $scope.togglePile = function(pile: Pile){
      let hiddenPile = _.find($scope.hiddenPiles, function(p){
        return p.name === pile.name;
      })
      if(hiddenPile){
        _.pull($scope.hiddenPiles, hiddenPile);
      }
      if(!hiddenPile){
        $scope.hiddenPiles.push(pile);
      }

    } 
    $scope.showPile = function (pile: Pile){
      if($scope.hiddenPiles.length === 0){
        return true;
      }
      let hiddenPile = _.find($scope.hiddenPiles, function(p){
        return p.name === pile.name;
      })
      if(hiddenPile){
        return false;
      }
      if(!hiddenPile){
        return true;
      }
    }

    $scope.deleteSelectedCard = function (targetcard: Card){
      _.remove($scope.selectedCards, function(card){
        return card.name === targetcard.name;
      })
    }

    $scope.deletePile = function (targetpile: Pile, $event){
      debugger;
      let popupoptions = {
        event: $event,
        scope: $scope,
        title: "Delete pile?",
        body: "This action cannot be reset !",
        left: $event.x,
        top: $event.y
      }
      let promise = confirmationpopup.show(popupoptions);
      debugger;
      promise.then(function(result){
        debugger;
        _.remove($scope.deck.piles, function(pile){
          return pile.name === targetpile.name;
        })
      }, function(error){
        debugger;
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

    $scope.showSavePopup = false;

    $scope.saveDeck = function (action){      
      // let stringdeck = JSON.stringify($scope.deck);
      if(action === "asNewDeck"){
        $scope.deck.id = null;
      }
      let deck = $scope.deck;      
      if(!$scope.deck.id){                
        // $http({ method: 'GET', url:'http://localhost:8006/cardnames'})
        $http({ method: 'POST', url: serverLocation + 'deck', data: deck}).then(function(result){           
          $scope.showSavePopup = true;
          $timeout(function(){
            $scope.showSavePopup = false;
          }, 2000)
        }, function(){
          alert("Saven mislukt.");
        });
      }
      if($scope.deck.id){
        $http({ method: 'PUT', url: serverLocation + 'deck', data: deck}).then(function(result){
          debugger;
          $scope.showSavePopup = true;
          $timeout(function(){
            $scope.showSavePopup = false;
          }, 2000)
        }, function(){
          alert("Saven mislukt.");
        });
      }
    }
    function loadAllDecks (){
      $http({ method: 'GET', url: serverLocation + 'alldecks'}).then(function(alldecks){                         
        let parsedDecks = _.map(alldecks.data, function(deck: Deck){
          let parsedDeck = {
            id: deck.id,
            name: deck.name,
            piles: JSON.parse(deck.piles)
          }
          return parsedDeck;
        })
       
        $scope.alldecks = parsedDecks;
        let latestActiveDeckName = localStorage.getItem("latestActiveDeck");        
        if(latestActiveDeckName){
          let latestActiveDeck = _.find($scope.alldecks, function(deck){
            return deck.name === latestActiveDeckName;
          })
          if(latestActiveDeck){
            $scope.deck= latestActiveDeck;
          }
        }        
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
      if($scope.deck && $scope.deck.name){
        localStorage.setItem('latestActiveDeck', $scope.deck.name);
        localStorage.setItem('hiddenPiles', JSON.stringify($scope.hiddenPiles));
      }
      return "Are you sure you want to navigate away from this page. Unsaved changes will be lost.";      
    };
  })

  // TO DO: make function in service functions: amountOfDifferentCards in pile


// start the app
/*var kickStart = function () {
  angular.bootstrap(document, ['mtg_commander_app']);
};

angular.element(document).ready(function () { //Browser
  kickStart();  
});*/


