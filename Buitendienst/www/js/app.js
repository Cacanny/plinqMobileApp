// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('directory', ['ionic', 'angular.filter', 'ngCordova', 'directory.services', 'directory.controllers'])

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

        document.addEventListener("deviceready", onDeviceReady, false);

            function onDeviceReady() {
                alert('deviceready');
                        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI });

                        function onSuccess(imageURI) {
                            var image = document.getElementById('myImage');
                            image.src = imageURI;
                        }

                        function onFail(message) {
                            alert('Failed because: ' + message);
                        }
            }

    })

    .config(function ($stateProvider, $urlRouterProvider){

        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.planning', {
                url: "/planning",
                templateUrl: "templates/planning-index.html",
                controller: 'PlanningIndexCtrl'
            })

            .state('app.order', {
                url: "/order/:orderId",
                templateUrl: "templates/order-details.html",
                controller: 'OrderDetailCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/planning');
    });
