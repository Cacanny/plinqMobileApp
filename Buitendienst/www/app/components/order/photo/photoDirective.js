
angular.module('directory.photoDirective', [])

.directive('photoGrid', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/components/order/photo/photo-grid.html',
        controller: 'OrderCtrl'
    };
});