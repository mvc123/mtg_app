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

  function DemoCtrl ($timeout, $http, $q, $log, $scope, $rootScope) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;    
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.selectedItem = "";
    
    // when user clicks on item in autosuggest
    function selectedItemChange (item){            
      if(item && item.display){
        $http({method: 'GET', url:'http://localhost:8006/card', params: { 'cardname': item.display}})
        .then(function(cards){                    
          var cardarray = cards.data;
          // remove all cards that don't have a multiverseId = corresponding picture'                                                
          _.remove(cardarray, function(card){
            return !card.multiverseId;
          });          
          $scope.cbCardVersionsLoaded(cardarray);          
        })
      }
    }
    

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

    // load all cards    
    function loadAll() {
      debugger;
      var version = 4;
      var request = window.indexedDB.open("mtg_app", version);
      request.onerror = function (event) {

      }
      request.onsuccess = function (event) {
        debugger;
        var db = event.target.result;
        db.onerror = function (event){
          alert("Database error: " + event.target.errorCode);
        }
      }
      request.onupgradeneeded = function (event) {
        debugger;
        var db = event.target.result;
        var objectStore = db.createObjectStore("allcards", { autoIncrement : true});
        var cards = ["Fork", "Giant Growth"];
        for(var i in cards){
          objectStore.add(cards[i]);
        }   
      }

      $http({ method: 'GET', url: 'http://localhost:8006/cardnames' }).then(function (response) {
        var cardNames = _.map(response.data, function (card) {
          return card.name;
        });
        var uniqueCardNames = _.uniq(cardNames)
        var allCardsArray = uniqueCardNames.map(function (cardname) {
          return {
            value: cardname.toLowerCase(),
            display: cardname
          };
        });
        self.states = allCardsArray;
      })
    }


        
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

// problem: pass array of cardversions from autocomplete to smallSlider 
// (2 directives next to each other / same level)
// solution 1: put cardVersions on rootScope ($rootScope.cardVersions = ... ,
// smallSlider receives collection from attributes.
// solution 2: autocomplete uses $rootScope.$emit('newCardversions', array) / 
// app.js uses $rootScope.$on('cardVersions', function(event, cardVersions){ $scope.cardVersions = cardVersions})
// $rootScope.$emit only lets other $rootScope listeners catch it.
// http://stackoverflow.com/questions/26752030/rootscope-broadcast-vs-scope-emit                                    
// solution 3: app.js puts cbCardVersionsLoaded on it's scope. the function is called in autocomplete.js. 
// cbCardVersionsLoaded puts the cardVersions on it's scope (the scope of ) and so smallSlider can see them !!!