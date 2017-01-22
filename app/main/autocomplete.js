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
          // $rootScope.$emit only lets other $rootScope listeners catch it.
          // http://stackoverflow.com/questions/26752030/rootscope-broadcast-vs-scope-emit                                    
          $rootScope.$emit('cardVersions', cardarray); // cardVersions are put on the rootScope, smallSlider can see them.
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