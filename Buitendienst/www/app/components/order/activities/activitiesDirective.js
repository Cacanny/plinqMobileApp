angular.module('directory.activitiesDirective', [])
    .directive('activitiesView', function() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/activities/activitiesView.html',
            controller: 'ActivitiesCtrl'
        }

    });