angular.module('directory.completeDirective', [])
    .directive('completeView', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/complete/completeView.html',
            controller: 'CompleteCtrl'
        }

    });