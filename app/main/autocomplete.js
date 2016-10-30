  'use strict';
  angular
      .module('autocomplete',['ngMaterial' /*,'ngMessages', 'material.svgAssetsCache'*/])
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
    // self.searchTextChange   = searchTextChange;

    // self.newState = newState;

    /*function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
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

    /*function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }*/
    
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