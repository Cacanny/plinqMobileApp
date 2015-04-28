angular.module('directory.ticketDirective', [])
    .directive('ticketView', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/ticket/ticketView.html',
            controller: 'OrderCtrl'
        }

    });