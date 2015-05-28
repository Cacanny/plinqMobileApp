
angular.module('directory.appRoutes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Set up the various states which the app can be in.
        // Each state's controller can be found in the designated folder in either shared or components of app.
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'app/components/login/loginView.html',
                controller: 'LoginCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/shared/menu/menu.html'
            })

            .state('app.planning', {
                url: '/planning',
                templateUrl: 'app/components/planning/planningView.html',
                controller: 'PlanningCtrl'
            })

            .state('app.order', {
                url: '/order/:orderId',
                templateUrl: 'app/components/order/orderView.html',
                controller: 'OrderCtrl'
            })

            .state('test', {
                url: '/test',
                templateUrl: 'app/shared/test/test.html',
                controller: 'PhotoCtrl'
            });  
             
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/planning');
    });