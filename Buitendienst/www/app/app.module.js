// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('directory', [
        'ionic',
        'angular.filter',
        'monospaced.elastic',
        'ngCordova',
        'ionicLazyLoad',
        'directory.appRoutes',
        'directory.planningService',
        'directory.planningController',
        'directory.orderService',
        'directory.orderController',
        'directory.activitiesDirective',
        'directory.activitiesController',
        'directory.activitiesService',
        'directory.commentDirective',
        'directory.commentController',
        'directory.commentService',
        'directory.completeDirective',
        'directory.completeController',
        'directory.completeService',
        'directory.detailsDirective',
        'directory.subscriptionDirective',
        'directory.subscriptionController',
        'directory.ticketDirective',
        'directory.ticketController',
        'directory.ticketFilter',
        'directory.signatureController',
        'directory.photoDirective',
        'directory.photoService',
        'directory.photoController'
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
    });