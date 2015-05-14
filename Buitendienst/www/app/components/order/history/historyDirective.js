angular.module('directory.historyDirective', [])
    .directive('historyView', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/order/history/historyView.html',
            controller: 'HistoryCtrl'
        }

    });