/// <reference path="../../typings/all.d.ts" />

interface Popup {
  show(options): void;
}

angular.module("services", [])
  .factory("popup", function ($document, $compile, $q) {
    let popup: Popup = {}
    popup.show = function (options) {            
      let popupscope = options.scope.$new();
      popupscope.options = options;
      popupscope.title = options.title;
      popupscope.close = close;
      let content = options.content;
      let directiveHTML = "";
      if(content === "checkList"){
        directiveHTML = '<div checklist deck="deck" ></div>'
      }
      if(content === "ccCounter"){
        directiveHTML = '<div cc-counter deck="deck" ></div>'
      }
      if(content === "ctCounter"){
        directiveHTML = '<div ct-counter deck="deck" ></div>'
      }      
      var body = $document.find('body').eq(0);
      var template = $compile('<div class="popup">{{ title }}<button ng-click="close()">SLUIT</button>'+ directiveHTML +'</div>')(popupscope);
      body.append(template);
      function close (){
      debugger;        
        popupscope.$destroy();
        template.remove();        
      }
      var deferred = $q.defer() // returns a "deferred object"
      var promise = deferred.promise; // the "deferred object" has a .promise property which returns your newly created property      
      return promise; // this promise is returned and will be resolved in the close function with a certain value.
    }
    return popup;
  })
  .factory("confirmationpopup", function ($document, $compile, $q) {
    let confirmationpopup = {};
    confirmationpopup.show = function (options) {
      debugger;            
      let popupscope = options.scope.$new();
      popupscope.title = options.title;
      popupscope.body = options.body;
      popupscope.confirm = confirm;
      popupscope.cancel = cancel;
      var body = $document.find('body').eq(0);
      var template = $compile('<div class="popup" style="top:' + options.top + '; left:' + options.left + '"><p>{{ title }}</p><p>{{ body }}</p><button ng-click="confirm()">OK</button><button ng-click="cancel()">NOT OK</button></div>')(popupscope);
      body.append(template);
      function confirm (){
        debugger;
        popupscope.$destroy();
        template.remove();
        deferred.resolve();        
      }
      function cancel(){
        debugger;
        popupscope.$destroy();
        template.remove();
        deferred.reject();
      }
      // $q.defer() is a thenable promise manager = object with functions for creating and manipulating promises.
      // $q.defer().promise creates a promise object, which will be returned to be resolved or rejected later.
      // $q.defer().resolve(value) fullfills the created promise with a value
      // $q.defer().reject(error) rejects the created promise with an error
      var deferred = $q.defer() 
      var promise = deferred.promise;
      return promise;
    }
    return confirmationpopup;
  })
  .factory("proxypopup", function($document, $compile, $q){
    let proxypopup= {};
    proxypopup.show = function(options){
        let proxypopupscope = options.scope.$new();
        proxypopupscope.confirm = confirm;
        proxypopupscope.cancel = cancel;
        proxypopupscope.proxy= {
            name: "",
            text: ""
        }        
        var body = $document.find('body').eq(0);
        var template = $compile('<div class="popup"><p>{{ title }}</p><input type="text" ng-model="proxy.name"></input><input type="textarea" ng-model="proxy.text"></input><button ng-click="confirm()">OK</button><button ng-click="cancel()">NOT OK</button></div>')(proxypopupscope);
        body.append(template);
        
        function confirm (){
            debugger;
            deferred.resolve(proxypopupscope.proxy);
            proxypopupscope.$destroy();
            template.remove();    
        }
        function cancel (){
            debugger;
            deferred.reject("canceled");
            proxypopupscope.$destroy();
            template.remove();   
        }        
        let deferred = $q.defer();
        let promise = deferred.promise;
        return promise;
    }
    return proxypopup;
  })
  .factory("colors", function () {
    return {
      green: {
        name: "green",
        abbreviation: "G",
        colorCode: "",
        pathToImg: "manasymbols/greenMana.png"
      },
      red: {
        name: "red",
        abbreviation: "R",
        colorCode: "",
        pathToImg: "manasymbols/redMana.png"
      },
      blue: {
        name: "blue",
        abbreviation: "U",
        colorCode: "",
        pathToImg: "manasymbols/blueMana.png"
      },
      black: {
        name: "black",
        abbreviation: "B",
        colorCode: "",
        pathToImg: "manasymbols/blackMana.png"
      },
      white: {
        name: "white",
        abbreviation: "W",
        colorCode: "",
        pathToImg: "manasymbols/whiteMana.png"
      }
    }
  })  
  .directive("colorCounter", function (colors) {
    // TO DO: works on init not on add card to list, scope.$watch not working
    return {
      scope: {
        pile: "=pile"
      },
      templateUrl: "manasymbols/colorCounter.html",
      link: function (scope) {
        scope.colors = colors;
        scope.$watch("pile", function (newValue, oldValue) {
          if (newValue) {
            countManaSymbols();
          }
        }, true);

        function countManaSymbols() {
          let blackSymbols = _.chain(scope.pile.cards)
            .filter(function (card: Card) { return _.includes(card.colorIdentity, "B") })
            .map(function (blackcard: Card) { return blackcard.manacost.replace(/[^B]/g, "") })
            .reduce(function (total, n) { return total + n })
            .value();
          scope.amountBlackSymbols = blackSymbols ? blackSymbols.length : undefined;

          let whiteSymbols = _.chain(scope.pile.cards)
            .filter(function (card: Card) { return _.includes(card.colorIdentity, "W") })
            .map(function (whitecard: Card) { return whitecard.manacost.replace(/[^W]/g, "") })
            .reduce(function (total, n) { return total + n })
            .value();
          scope.amountWhiteSymbols = whiteSymbols ? whiteSymbols.length : undefined;

          let blueSymbols = _.chain(scope.pile.cards)
            .filter(function (card: Card) { return _.includes(card.colorIdentity, "U") })
            .map(function (bluecard: Card) { return bluecard.manacost.replace(/[^U]/g, "") })
            .reduce(function (total, n) { return total + n })
            .value();
          scope.amountBlueSymbols = blueSymbols ? blueSymbols.length : undefined;

          let greenSymbols = _.chain(scope.pile.cards)
            .filter(function (card: Card) { return _.includes(card.colorIdentity, "G") })
            .map(function (greencard: Card) { return greencard.manacost.replace(/[^G]/g, "") })
            .reduce(function (total, n) { return total + n })
            .value();
          scope.amountGreenSymbols = greenSymbols ? greenSymbols.length : undefined;

          let redSymbols = _.chain(scope.pile.cards)
            .filter(function (card: Card) { return _.includes(card.colorIdentity, "R") })
            .map(function (redcard: Card) { return redcard.manacost.replace(/[^R]/g, "") })
            .reduce(function (total, n) { return total + n })
            .value();
          scope.amountRedSymbols = redSymbols ? redSymbols.length : undefined;
        }
        countManaSymbols();
      }
    }
  })
  .directive("checklist", function () {
    return {
      scope: {
        deck: "=",
      },
      templateUrl: "templates/checklist.html",
      link: function (scope, element, attributes) {
        scope.$watch("deck", function (deck: Deck) {
          if (deck.piles.length !== 0) {
            scope.cardsNames = createCardsNamesArray(deck);
          }
        }, true)

        function createCardsNamesArray(deck: Deck) {          
          let cardsNamesArray = [];
          _.forEach(deck.piles, function (pile: Pile) {
            _.forEach(pile.cards, function (card: Card) {
              cardsNamesArray.push({ name: card.name, checked: false });
            })
          })
          return cardsNamesArray;
        }
      }
    }
  })
    /*.factory("confirmationpopup", function($document, $compile){
        let confirmationpopup = {}
        confirmationpopup.show = function ($event){
            debugger;
            let positionobject = {
                x: $event.pageX,
                y: $event.pageY
            };
            let popupelement = '<div style="font-size:100px; position: absolute; top:' + positionobject.y + 'px; left:' + positionobject.x + 'px;">sdjflskdfjlsdfkj<div popup type="confirmation"></div></div>';
            let body = $document.find('body').eq(0);
            body.append($compile(popupelement)(scope));            
        }
        return confirmationpopup;
    })*/