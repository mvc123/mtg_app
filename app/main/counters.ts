/// <reference path="../../typings/all.d.ts" />

angular.module('counters', [])
    .directive('ccCounter', function(){
        return {
            scope: {
                deck: "=deck"
            },
            templateUrl: 'templates/ccCounter.html',
            link: function(scope: any, element, attributes){
                scope.$watch("deck", function(deck: Deck){
                    debugger;
                    if(deck.piles.length !== 0){
                        countCardsCC(deck);
                    }
                }, true)
                function countCardsCC(deck: Deck){
                    debugger;
                    let allCmc = {
                        cc0:0, cc1:0, cc2:0, cc3:0, cc4:0, cc5:0, cc6:0, cc7:0, cc8:0, cc9:0, cc10:0, cc11:0, cc12:0, cc13:0, cc14:0, cc15:0
                    }
                    _.forEach(deck.piles, function(pile){
                        _.forEach(pile.cards, function(card){
                            let cmc= card.cmc;
                            let variable = "cc" + cmc.toString();
                            allCmc[variable] = allCmc[variable] + 1;  
                        })
                    })
                    scope.allCmc = allCmc;
                }

            } 
        } 
    });
