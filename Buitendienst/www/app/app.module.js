// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('directory', [
        'ionic',
        'angular.filter',
        'monospaced.elastic',
        'ngCordova',
        'directory.appRoutes',
        'directory.planningService',
        'directory.planningController',
        'directory.orderService',
        'directory.orderController',
        'directory.activitiesDirective',
        'directory.commentDirective',
        'directory.completeDirective',
        'directory.detailsDirective',
        'directory.photoDirective',
        'directory.subscriptionDirective',
        'directory.ticketDirective',
        'directory.signatureController',
        'directory.photoService'

])
    .config(function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });

        // document.addEventListener("deviceready", onDeviceReady, false);

        //     function onDeviceReady() {
        //         alert('deviceready');
        //                 navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        //                     destinationType: Camera.DestinationType.FILE_URI });

        //                 function onSuccess(imageURI) {
        //                     var image = document.getElementById('myImage');
        //                     image.src = imageURI;
        //                 }

        //                 function onFail(message) {
        //                     alert('Failed because: ' + message);
        //                 }
        //     }

    });