angular.module('directory.commentDirective', [])
    .directive('commentView', function() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/comment/commentView.html',
            controller: 'OrderCtrl'
        }

    });