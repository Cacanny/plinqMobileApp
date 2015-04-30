angular.module('directory.subscriptionController', [])

    .controller('SubscriptionCtrl', function ($scope, $filter) {   
        
        // Determine if tabs should be showed or not
    	$scope.showInternet = true;
        $scope.showTelevisie = true;
        $scope.showTelefoon = true;
        
        if (JSON.stringify($scope.order.klant.abonnement.internet) === '{}') {
            $scope.showInternet = false;
        }  
        if (JSON.stringify($scope.order.klant.abonnement.televisie) === '{}') {
            $scope.showTelevisie = false;
        }
        if (JSON.stringify($scope.order.klant.abonnement.telefoon) === '{}') {
            $scope.showTelefoon = false;
        }
    });
