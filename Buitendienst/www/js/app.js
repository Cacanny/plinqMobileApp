// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('directory', ['ionic', 'directory.services', 'directory.controllers'])

    .config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider){

        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('planning-index', {
                url: '/planning',
                templateUrl: 'templates/planning-index.html',
                controller: 'PlanningIndexCtrl'
            })

            .state('order-details', {
                url: '/order',
                templateUrl: 'templates/order-details.html',
                controller: 'OrderDetailCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/planning');
    });
