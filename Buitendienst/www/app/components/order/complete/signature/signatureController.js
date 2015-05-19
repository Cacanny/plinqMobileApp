angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function ($scope, CompleteService) {
        angular.element(document).ready(function () {
            // Check if the order has been sent with the 'Afgerond' status, if so, disable the two buttons
            if($scope.orderFinished) {
                angular.element(document).ready(function () {
                    var elements = document.getElementsByClassName('removeAfterFinish');
                    console.log(elements);
                    for(var index = 0; index < elements.length; index += 1) {
                        elements[index].style.display = 'none';
                    }
                });
            }

            // This has to be called everytime the Modal opens
            var canvas = document.getElementById('signatureCanvas');
            resizeCanvas();
            var signaturePad = new SignaturePad(canvas);
            signaturePad.backgroundColor = "white";

            signaturePad.minWidth = 2;
            signaturePad.maxWidth = 4.5;

            CompleteService.setCanvas(canvas);

            CompleteService.getSignatureImage($scope.order.orderid).then(function(signature){
                signaturePad.fromDataURL(signature);
            });

            $scope.clearCanvas = function () {
                signaturePad.clear();
            }

            $scope.saveCanvas = function () {
                if(!signaturePad.isEmpty()) {
                    var sigImg = signaturePad.toDataURL();
                    CompleteService.setSignatureImage($scope.order.orderid, sigImg);
                } else {
                    var sigImg = '';
                    CompleteService.setSignatureImage($scope.order.orderid, sigImg);
                }
            }

            function resizeCanvas() {
                var ratio = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - 96; 
            }
        });
    
    });