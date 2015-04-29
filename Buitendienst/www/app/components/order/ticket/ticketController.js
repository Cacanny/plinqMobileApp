angular.module('directory.ticketController', [])

    .controller('TicketCtrl', function ($scope, $filter) {   
        
        // Determine if the tickettab should be showed or not
    	$scope.showTickets = true;
        
        if (JSON.stringify($scope.order.ticket) === '{}') {
            $scope.showTickets = false;
        }

        // Toggle the filter for 'notitie' on click
        var shouldRunFilter = false;
        var originalNote;

        $scope.toggleFilter = function (_notitie, index){
        	shouldRunFilter = !shouldRunFilter;

        	if(shouldRunFilter) {
        		originalNote = $scope.order.ticket.ticketregels[index].notitie;
        		$scope.order.ticket.ticketregels[index].notitie = $filter('getSlice')(_notitie);
        	} else {
        		$scope.order.ticket.ticketregels[index].notitie = originalNote;
        	}
    	}
    
    });
