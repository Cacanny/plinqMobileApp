angular.module('directory.completeController', [])

    .controller('CompleteCtrl', function ($scope, CompleteService) {
        CompleteService.getSignatureImage($scope.order.orderid).then(function (signature) {
            $scope._signatureImage = signature;
        });

        $scope.openSignature = function() {
            $scope.openModal('app/components/order/complete/signature/signaturepadView.html');
            CompleteService.setSignaturePad(true);
        }

        $scope.closeSignature = function () {
            $scope.modal.hide();
            CompleteService.setSignaturePad(false);
            
            CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
            	$scope._signatureImage = signature;
            });              
        }	
    });
