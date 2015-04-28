angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function ($scope, OrderService) {
        var canvas = document.getElementById('signatureCanvas');
        resizeCanvas();
        var signaturePad = new SignaturePad(canvas);
        signaturePad.backgroundColor = "white";

        signaturePad.minWidth = 2;
        signaturePad.maxWidth = 4.5;

        $scope.clearCanvas = function () {
            signaturePad.clear();
        }

        $scope.saveCanvas = function () {
            var sigImg = signaturePad.toDataURL();
            $scope.signature = sigImg;
            OrderService.setSignatureImage(sigImg);
        }

        function resizeCanvas() {
            var ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth; //document.width is obsolete
            canvas.height = window.innerHeight - 96; //document.height is obsolete
        };
    });