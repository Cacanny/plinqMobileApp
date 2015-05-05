angular.module('directory.completeController', [])

    .controller('CompleteCtrl', function ($scope, CompleteService) {
    	CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
            $scope._signatureImage = signature;
        });

    	$scope.closeSignature = function () {
            $scope.modal.hide();
            $scope.modal.remove();
            CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
            	$scope._signatureImage = signature;
            });              
        }	
    });
