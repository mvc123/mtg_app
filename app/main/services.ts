/// <reference path="../../typings/all.d.ts" />

interface Popup {
  show(): void;
}

angular.module("services", [])
  .factory("popup", function ($document, $compile) {
    let popup = {}
    popup.show = function (options) {      
      let popupscope = options.scope.$new();
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
        popupscope.$destroy();
        template.remove();        
      }
      /*    var deferred = $q.defer()
      deferred.resolve("Het is gelukt!");
      deferred.reject("Nee, mislukt!");*/
      //return deferred.promise;
    }
    return popup;
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
          debugger;
          if (deck.piles.length !== 0) {
            scope.cardsNames = createCardsNamesArray(deck);
          }
        }, true)

        function createCardsNamesArray(deck: Deck) {
          debugger;
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