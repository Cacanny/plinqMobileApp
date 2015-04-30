angular.module('directory.photoDirective', [])
    .directive('photoView', function() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/photo/photoView.html',
            controller: 'PhotoCtrl'
        }

    });
