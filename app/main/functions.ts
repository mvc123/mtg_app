/// <reference path="../../typings/all.d.ts" />

angular.module("functions", [])
	.factory("amountOfDifferentCards", function(){
		return function(deck: Deck): number{
      if(!deck){ return };
      if(!deck.piles){ return };
      let allCards = [];
      _.forEach(deck.piles, function(pile){        
        _.forEach(pile.cards, function(card){
          allCards.push(card);
        })
      })
      let filterAllCards = _.uniqBy(allCards, 'name'); // tsc gives wrong info
      return filterAllCards.length;
    }
	})