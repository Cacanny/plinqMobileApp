angular.module('directory.completeController', [])

    .controller('CompleteCtrl', function ($scope, $rootScope, CompleteService) {
        CompleteService.getSignatureImage($scope.order.orderid).then(function (signature) {
            $scope._signatureImage = signature.fileURL;
        });

        $scope.openSignature = function() {
            $scope.openModal('app/components/order/complete/signature/signaturepadView.html');
            var canvas = CompleteService.getCanvas();

            if(canvas) {
                var signaturePad = new SignaturePad(canvas);
                signaturePad.backgroundColor = "white";

                signaturePad.minWidth = 2;
                signaturePad.maxWidth = 4.5;

                CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
                    // This is actually not from a dataURL but from a fileURL
                    signaturePad.fromDataURL(signature.fileURL);
                });
            }
        }

        $rootScope.closeSignature = function () {
            $scope.modal.hide();
            
            CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
            	$scope._signatureImage = signature.fileURL;
            });              
        }	
    });
