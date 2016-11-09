  'use strict';
  angular
      .module('autocomplete',['ngMaterial'])
      .config(function ($stateProvider) {
        $stateProvider.state('autocomplete', {
          url: '/cardlookup',
          templateUrl: 'app/main/autocompletetemplate.html',
          controller: 'DemoCtrl'
        });
      })
      .controller('DemoCtrl', DemoCtrl);

  function DemoCtrl ($timeout, $http, $q, $log, $scope) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;    
    self.states        = loadAll();
    self.querySearch   = querySearch;
    // self.selectedItemChange = selectedItemChange;
    self.selectedItem = "";

    /*function selectedItemChange (item){
      alert(item); 
    }*/
    

    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
        
    function loadAll() {            
       $http({ method: 'GET', url:'http://localhost:8006/cardnames'}).then(function(response){                
        response.data = response.data.slice(0, -1);
        var allCardsString = response.data;          
        var allCardsArray = allCardsString.split(',').map( function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });                
        self.states = allCardsArray;                             
      })            
    }
        
    $scope.$on("loadCard", function (){            
      $http({method: 'GET', url:'http://localhost:8006/card', params: { 'cardname': self.selectedItem.display}})
        .then(function(cards){                    
          var cardarray = cards.data;
          // remove all cards that don't have a multiverseId = no picture.                           
          _.remove(cardarray, function(card){
            return !card.multiverseId;
          });
          /*http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=368970&type=card

          var para = document.createElement("p");
          var node = document.createTextNode("This is new.");
          para.appendChild(node);

          var element = document.getElementById("div1");
          element.appendChild(para);*/         
        })
    })

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }

/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/