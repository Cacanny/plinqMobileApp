angular.module('directory.ticketController', [])

    .controller('TicketCtrl', function ($scope, $filter) {   
        
        // Initial state of ng-show for the Ticketnotities
        $scope.showme = true;

        $scope.toggleSlice = function (notitie) {
            notitie = $filter('getSlice')(notitie);
            alert(notitie);
        }
    });
