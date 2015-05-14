angular.module('directory.ticketController', [])

    .controller('TicketCtrl', function ($scope, $filter) {   
        
        // Determine if the tickettab should be showed or not
    	$scope.showTickets = true;
        
        if (JSON.stringify($scope.order.ticket) === '{}') {
            $scope.showTickets = false;
        }

        var shouldRunFilter = [];
        var originalNote = [];

        // Apply the 'getSlice' filter to all ticket notities when the page is loaded
        function setInitialFilter() {
        	if($scope.showTickets) {
		        for(var index = 0; index < $scope.order.ticket.ticketregels.length; index += 1) {
		        	var notitie = $scope.order.ticket.ticketregels[index].notitie;
		        	originalNote.push(notitie);
		        	shouldRunFilter.push(false);
		        	$scope.order.ticket.ticketregels[index].notitie = $filter('getSlice')(notitie);
		        }
	    	}
    	}
    	setInitialFilter();

    	// Toggle the filter 'getSlice' on click
    	$scope.toggleFilter = function (_notitie, index) {
	        console.log("Er is gedrukt op de ticket toggle filter ");
        	if(shouldRunFilter[index]) {
        		shouldRunFilter[index] = false;
        		$scope.order.ticket.ticketregels[index].notitie = $filter('getSlice')(_notitie);
        	} else {
        		shouldRunFilter[index] = true;
        		$scope.order.ticket.ticketregels[index].notitie = originalNote[index];
        	}
    	}    

        // Check if user leaves page and set all ticket notities back to their original without filter applied
        var myInterval = setInterval(1);
        $scope.$on("$destroy", function(){
            for(var index = 0; index < shouldRunFilter.length; index += 1) {
                $scope.order.ticket.ticketregels[index].notitie = originalNote[index];
            }
            clearInterval(myInterval);
        });
    });
