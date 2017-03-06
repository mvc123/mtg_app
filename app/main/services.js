/// <reference path="../../typings/all.d.ts" />
angular.module("services", [])
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
    };
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
                var blackSymbols = _.chain(scope.pile.cards)
                    .filter(function (card) { return _.includes(card.colorIdentity, "B"); })
                    .map(function (blackcard) { return blackcard.manacost.replace(/[^B]/g, ""); })
                    .reduce(function (total, n) { return total + n; })
                    .value();
                scope.amountBlackSymbols = blackSymbols ? blackSymbols.length : undefined;
                var whiteSymbols = _.chain(scope.pile.cards)
                    .filter(function (card) { return _.includes(card.colorIdentity, "W"); })
                    .map(function (whitecard) { return whitecard.manacost.replace(/[^W]/g, ""); })
                    .reduce(function (total, n) { return total + n; })
                    .value();
                scope.amountWhiteSymbols = whiteSymbols ? whiteSymbols.length : undefined;
                var blueSymbols = _.chain(scope.pile.cards)
                    .filter(function (card) { return _.includes(card.colorIdentity, "U"); })
                    .map(function (bluecard) { return bluecard.manacost.replace(/[^U]/g, ""); })
                    .reduce(function (total, n) { return total + n; })
                    .value();
                scope.amountBlueSymbols = blueSymbols ? blueSymbols.length : undefined;
                var greenSymbols = _.chain(scope.pile.cards)
                    .filter(function (card) { return _.includes(card.colorIdentity, "G"); })
                    .map(function (greencard) { return greencard.manacost.replace(/[^G]/g, ""); })
                    .reduce(function (total, n) { return total + n; })
                    .value();
                scope.amountGreenSymbols = greenSymbols ? greenSymbols.length : undefined;
                var redSymbols = _.chain(scope.pile.cards)
                    .filter(function (card) { return _.includes(card.colorIdentity, "R"); })
                    .map(function (redcard) { return redcard.manacost.replace(/[^R]/g, ""); })
                    .reduce(function (total, n) { return total + n; })
                    .value();
                scope.amountRedSymbols = redSymbols ? redSymbols.length : undefined;
            }
            countManaSymbols();
        }
    };
})
    .factory("confirmationpopup", function ($document) {
    var confirmationpopup = {};
    confirmationpopup.show = function ($event) {
        debugger;
        var positionobject = {
            x: $event.pageX,
            y: $event.pageY
        };
        var popupelement = angular.element('<div style="font-size:120px; position: absolute; top:' + positionobject.y + 'px; left:' + positionobject.x + 'px;">Dit is de popup.</div>');
        var body = $document.find('body').eq(0);
        body.append(popupelement);
    };
    return confirmationpopup;
});
