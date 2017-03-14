/// <reference path="../../typings/all.d.ts" />

interface Link {
    name: string;
    url: string;
}

interface LinksScope {
    links: Link[];
    linksClosed: boolean;
    toggleLinks(): void;
    getListClass(): string;
}

angular.module('links',[])
    .directive('myLinks', function(){        
        return {
            scope: {},
            templateUrl: 'templates/myLinks.html',
            link: function($scope: LinksScope, element, attributes){
                $scope.links = [
                    { name: "Gatherer",
                      url: "http://gatherer.wizards.com"},
                    { name:"Magic Card Market",
                      url:"https://www.magiccardmarket.eu"},
                    { name: "Magicers",
                      url: "http://www.magicers.nl"                         
                    },
                    { name: "Card Kingdom",
                      url: "http://www.cardkingdom.com"                         
                    }
                ];
                
                $scope.linksClosed = true;

                $scope.toggleLinks = function (){
                    $scope.linksClosed = !$scope.linksClosed;  
                }


                $scope.getListClass = function (){
                    if($scope.linksClosed){
                        return "linksClosed";
                    }
                    if(!$scope.linksClosed){
                        return  "linksOpened";
                    }
                }
            }
        }
    })