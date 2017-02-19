/// <reference path="../../typings/all.d.ts" />
angular.module("functions", [])
    .factory("amountOfDifferentCards", function () {
    return function (deck) {
        if (!deck) {
            return;
        }
        ;
        if (!deck.piles) {
            return;
        }
        ;
        var allCards = [];
        _.forEach(deck.piles, function (pile) {
            _.forEach(pile.cards, function (card) {
                allCards.push(card);
            });
        });
        var filterAllCards = _.uniqBy(allCards, 'name'); // tsc gives wrong info
        return filterAllCards.length;
    };
});
