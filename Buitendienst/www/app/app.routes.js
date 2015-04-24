﻿
angular.module('appRoutes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Set up the various states which the app can be in.
        // Each state's controller can be found in the designated folder in either shared or components of app.
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "app/shared/menu/menu.html"
            })

            .state('app.planning', {
                url: "/planning",
                templateUrl: "app/components/planning/planningView.html",
                controller: 'PlanningIndexCtrl'
            })

            .state('app.order', {
                url: "/order/:orderId",
                templateUrl: "app/components/order/orderView.html",
                controller: 'OrderDetailCtrl'
            })

            .state('signature', {
                url: "/signature",
                templateUrl: "app/components/order/signature/signaturepadView.html"
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/planning');
    });