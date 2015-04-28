angular.module('directory.detailsDirective', [])
    .directive('detailsView', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/details/detailsView.html',
            controller: 'OrderCtrl'
        }

    });