angular.module('directory.historyController', [])

    .controller('HistoryCtrl', function ($scope, $filter) {
        // Determine if the orderhistory tab should be showed or not
        $scope.showHistory = true;

        if (JSON.stringify($scope.order.orderhistorie) === '{}') {
            $scope.showHistory = false;
            
        }
        var shouldRunFilter = [];
        var originalNote = [];

        // Apply the 'getSlice' filter to all order history notes when the page is loaded
        function setInitialFilter() {
            if ($scope.showHistory) {
                for (var index = 0; index < $scope.order.orderhistorie.length; index += 1) {
                    var notitie = $scope.order.orderhistorie[index].vervolgactie;
                    originalNote.push(notitie);
                    shouldRunFilter.push(false);
                    $scope.order.orderhistorie[index].vervolgactie = $filter('getSlice')(notitie);
                }
            }
        }
        setInitialFilter();

        // Toggle the filter 'getSlice' on click
        $scope.toggleHistoryFilter = function (_notitie, index) {
            if (shouldRunFilter[index]) {
                shouldRunFilter[index] = false;
                $scope.order.orderhistorie[index].vervolgactie = $filter('getSlice')(_notitie);
            } else {
                shouldRunFilter[index] = true;
                $scope.order.orderhistorie[index].vervolgactie = originalNote[index];
            }
        }

        // Check if user leaves page and set all 'vervolgactie' notities back to their original without filter applied
        var myInterval = setInterval(1);
        $scope.$on("$destroy", function () {
            for (var index = 0; index < shouldRunFilter.length; index += 1) {
                $scope.order.orderhistorie[index].vervolgactie = originalNote[index];
            }
            clearInterval(myInterval);
        });
    });
