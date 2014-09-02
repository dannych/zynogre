angular.module('zynogre', ['firebase','ui.bootstrap'])

    .factory('activityFactory', function($firebase) {
      var factory = {};
      
      factory.getActivities = function(date) {
        var db = new Firebase("https://zynogre.firebaseio.com/data/" + date);
        var sync = $firebase(db);
        return sync.$asArray();
      };
      
      return factory;
    })
    
    .factory('limitFactory', function($firebase){
      var factory = {};
      
      factory.getLimits = function() {
        var db = new Firebase("https://zynogre.firebaseio.com/limit")
        var sync = $firebase(db);
        return sync.$asObject();
      };
      
      return factory;
    })
    
    .directive('eventForm', function() {
      return {
        restrict: "E",
        templateUrl: "event-form.html"
      };
    })
    
    .directive('eventList', function() {
      return {
        restrict: "E",
        templateUrl: "event-list.html"
      };
    })

    .directive('calendarPanel', function(){
      return {
        restrict: "E",
        templateUrl: "calendar-panel.html"
      }
    })
    .controller('calendarCtrl', function($scope,$filter,$firebase,activityFactory,limitFactory) {
        // Variable to contain form values
        $scope.form = [];
        
        $scope.initializeLimit = function() {
          $scope.limit = limitFactory.getLimits();
          // alert($scope.limit.new);
        };
        $scope.initializeLimit();
        
        $scope.isNewEvent = function(hypemeter) {
          return hypemeter < $scope.limit.new;
        };
        
        $scope.isHotEvent = function(hypemeter) {
          return hypemeter >= $scope.limit.hot;
        };
        
        $scope.isPopularEvent = function (hypemeter) {
          return hypemeter >= $scope.limit.popular && hypemeter < $scope.limit.hot;
        };
        
        $scope.showActivities = function() {
          var activities = activityFactory.getActivities($filter('date')($scope.date,'MMddyyyy'));
          $scope.activities = activities;
        };
        
        $scope.today = function() {
          $scope.date = new Date();
          $scope.showActivities();
        };
        $scope.today();
        
        $scope.clearDate = function () {
          $scope.date = null;
        };
      
        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        
        // $scope.hasPassed = function() {
        //   return $scope.date < new Date();
        // };
        
        $scope.closeForm = function() {
          $scope.form.status = false;
        };
        
        $scope.clearForm = function() {
          $scope.form = [];
        };

        $scope.addActivity = function() {
          var activity = [];
          
          // Get the data from form fields
          activity.title = $scope.form.title ? $scope.form.title : 'Anonymous Event';
          activity.location = $scope.form.location ? $scope.form.title : 'Hidden Location';
          activity.description = $scope.form.description;
          activity.createTime = $filter('date')(new Date(),'medium');
          
          // Initialize meta-data
          activity.hypemeter = 0;
          activity.messages = [];
          
          // Add the activity
          $scope.activities.$add(activity);
          
          // Return to initial state
          $scope.closeForm();
          $scope.clearForm();
        };
        
        $scope.addMessage = function() {
          // $scope.
        };
        
        $scope.increaseHype = function(id) {
          var url = "https://zynogre.firebaseio.com/data/" + $filter('date')($scope.date,'MMddyyyy') + "/" + id + "/hypemeter";
          
          var hypermeter = $firebase(new Firebase(url));
          hypermeter.$transaction(function(value) {
            return value + 1;
          });
        };
        
    });


