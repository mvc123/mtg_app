angular.module('mtg_commander_app')
  .directive('smallSlider', function () {    
    return {
      scope: {
        collection: "=",
        itemwidth: "@", // set at app.js, this is a string
        itemheight: "@", // set at app.js, this is a string
        clickslideritem:"=" // bind to external functions                
      },      
      templateUrl: "smallSlider.html",
      link: function($scope, element, attr){        
        
        $scope.init = function(collection){          
          $scope.slidercounter = 0;
          document.getElementById("itemswrapper").style.marginLeft = "0px";         
          if(collection){
            $scope.itemswrapperwidth = collection.length * $scope.itemwidth;
          } else {
            $scope.itemswrapperwidth = 0;
          } 
        }
        $scope.init($scope.collection);   
      
        $scope.navtop = ($scope.itemheight / 2) - 15;
        $scope.rightnav = parseInt($scope.itemwidth) + 10;
        $scope.showNav = function(direction){
          if (!$scope.collection || !$scope.collection.length) { return false};          
          if (direction === "previous") {
            return $scope.slidercounter >= 1 ? true : false;
          }              
          if (direction === "next") {
            return $scope.collection.length === 1 ? false : true; 
          }
        }

        $scope.slidercounter = 0;   
        $scope.previousItem = function(){                   
          $scope.slidercounter--;
          document.getElementById("itemswrapper").style.marginLeft = (-$scope.slidercounter * $scope.itemwidth).toString() + "px"; 
        };
        $scope.nextItem = function(){
          $scope.slidercounter++;          
          if($scope.slidercounter === $scope.collection.length){
            $scope.init($scope.collection);
          }                    
          document.getElementById("itemswrapper").style.marginLeft = (-$scope.slidercounter * $scope.itemwidth).toString() + "px";    
        };

        $scope.draggableCheck = function (item) {          
          return item.draggable ? true : false;  
        }                             
      }
    }
  })