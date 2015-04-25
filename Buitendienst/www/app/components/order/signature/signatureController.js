angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function($scope, OrderService) {
        var canvas = document.getElementById('signatureCanvas');
        resizeCanvas();
        var signaturePad = new SignaturePad(canvas);

        signaturePad.minWidth = 1.5;
        signaturePad.maxWidth = 2.5;

        $scope.clearCanvas = function() {
            signaturePad.clear();
        }

        $scope.saveCanvas = function() {
            var sigImg = signaturePad.toDataURL();
            $scope.signature = sigImg;
            OrderService.setSignatureImage(sigImg);
        }

        function resizeCanvas() {
            var ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth; //document.width is obsolete
            canvas.height = window.innerHeight - 100; //document.height is obsolete
        };
    });