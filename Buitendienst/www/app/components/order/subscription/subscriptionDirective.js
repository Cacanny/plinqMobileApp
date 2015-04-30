angular.module('directory.subscriptionDirective', [])
    .directive('subscriptionView', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/subscription/subscriptionView.html',
            controller: 'SubscriptionCtrl'
        }

    });