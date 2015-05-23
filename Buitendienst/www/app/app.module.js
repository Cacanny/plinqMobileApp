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
        'directory.historyFilter',
        'directory.historyDirective',
        'directory.historyController',
        'directory.signatureController',
        'directory.photoDirective',
        'directory.photoService',
        'directory.photoController'
])

    .config(function ($compileProvider, $ionicConfigProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
        $ionicConfigProvider.backButton.text('Terug').icon('ion-chevron-left');
        $ionicConfigProvider.navBar.alignTitle('center');
    })

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // org.apache.cordova.statusbar required
            if(window.StatusBar){
                StatusBar.hide();
            }

            if(ionic.Platform.isIOS()) {
                // cordova.plugins.notification.local.promptForPermission();
            }

             document.addEventListener("deviceready", function() {

                var now = new Date().getTime();
                var _10SecondsFromNow = new Date(now + 10 * 1000);
                // Schedule notification for tomorrow to remember about the meeting
                cordova.plugins.notification.local.schedule({
                    id: 10,
                    title: "Meeting in 15 minutes!",
                    text: "Jour fixe Produktionsbesprechung",
                    at: _10SecondsFromNow,
                    data: { meetingId:"#123FG8" }
                });

                // Join BBM Meeting when user has clicked on the notification 
                cordova.plugins.notification.local.on("click", function (notification) {
                    if (notification.id == 10) {
                        alert('geklikt!')
                    }
                });
             }, false);
        });
    });