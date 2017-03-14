/// <reference path="../../typings/all.d.ts" />
angular.module('links', [])
    .directive('myLinks', function () {
    return {
        scope: {},
        templateUrl: 'templates/myLinks.html',
        link: function ($scope, element, attributes) {
            $scope.links = [
                { name: "Gatherer",
                    url: "http://gatherer.wizards.com" },
                { name: "Magic Card Market",
                    url: "https://www.magiccardmarket.eu" },
                { name: "Magicers",
                    url: "http://www.magicers.nl"
                },
                { name: "Card Kingdom",
                    url: "http://www.cardkingdom.com"
                }
            ];
            $scope.linksClosed = true;
            $scope.toggleLinks = function () {
                $scope.linksClosed = !$scope.linksClosed;
            };
            $scope.getListClass = function () {
                if ($scope.linksClosed) {
                    return "linksClosed";
                }
                if (!$scope.linksClosed) {
                    return "linksOpened";
                }
            };
        }
    };
});
