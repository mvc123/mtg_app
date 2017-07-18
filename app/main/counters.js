/// <reference path="../../typings/all.d.ts" />
angular.module('counters', [])
    .directive('ctCounter', function () {
    return {
        scope: {
            deck: "=deck"
        },
        templateUrl: "templates/ctCounter.html",
        link: function (scope, element, attributes) {
            scope.$watch("deck", function (deck) {
                if (deck.piles.length !== 0) {
                    countCardsByType(deck);
                }
            }, true);
            function countCardsByType(deck) {
                var cardsByCardType = { artifact: 0, creature: 0, enchantment: 0, instant: 0, sorcery: 0,
                    planeswalker: 0, land: 0, tribal: 0 };
                _.forEach(deck.piles, function (pile) {
                    _.forEach(pile.cards, function (card) {
                        var cardTypesArray = card.types.toLowerCase().split(",");
                        _.forEach(cardTypesArray, function (cardType) {
                            cardsByCardType[cardType]++;
                        });
                    });
                });
                scope.cardsByCardType = cardsByCardType;
            }
        }
    };
})
    .directive('ccCounter', function () {
    return {
        scope: {
            deck: "=deck"
        },
        templateUrl: 'templates/ccCounter.html',
        link: function (scope, element, attributes) {
            scope.$watch("deck", function (deck) {
                if (deck.piles.length !== 0) {
                    countCardsCC(deck);
                }
            }, true);
            function countCardsCC(deck) {
                var allCmc = {
                    cc0: 0, cc1: 0, cc2: 0, cc3: 0, cc4: 0, cc5: 0, cc6: 0, cc7: 0, cc8: 0, cc9: 0, cc10: 0, cc11: 0, cc12: 0, cc13: 0, cc14: 0, cc15: 0
                };
                _.forEach(deck.piles, function (pile) {
                    _.forEach(pile.cards, function (card) {
                        if (!card.cmc) {
                            return;
                        }
                        var cmc = card.cmc;
                        var variable = "cc" + cmc.toString();
                        allCmc[variable] = allCmc[variable] + 1;
                    });
                });
                scope.allCmc = allCmc;
            }
        }
    };
})
    .directive('createProxy', function () {
    debugger;
    return {
        scope: {},
        templateUrl: 'templates/createProxy.html',
        link: function (scope, element, attributes) {
            debugger;
            var proxy = {
                cmc: null,
                colorIdentity: null,
                colors: null,
                imageName: null,
                manacost: null,
                multiverseId: null,
                name: null,
                power: null,
                subtypes: null,
                text: null,
                toughness: null,
                type: "proxy",
                types: null
            };
            scope.proxy = proxy;
        }
    };
});
