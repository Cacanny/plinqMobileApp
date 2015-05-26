angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function ($scope, CompleteService, OrderService) {
        angular.element(document).ready(function () {
            
            $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);
            // Check if the order has been sent with the 'Afgerond' status, if so, disable the two buttons
            OrderService.inQueueBool($scope.order.orderid).then(function(bool){
                if($scope.orderFinished && !bool) {
                    var elements = document.getElementsByClassName('removeAfterFinish');
                    for(var index = 0; index < elements.length; index += 1) {
                        elements[index].style.display = 'none';
                    }
                }
            });

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
                    var date = new Date();
                    var startTime = $scope.convertTime(date);
                    var startDate = $scope.convertDate(date);
                    startDate = startDate + " " + startTime;
                    var destination = "handtekening";
                    var geoLocation = $scope.getCurrentGeoLocation(destination, $scope.order.orderid);
                    OrderService.setStartDate($scope.order.orderid, startDate, destination);
                } else {
                    var sigImg = '';
                    CompleteService.setSignatureImage($scope.order.orderid, sigImg);
                }
            }

            function resizeCanvas() {
                var ratio = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth;

                if(ionic.Platform.isIOS()) {
                    canvas.height = window.innerHeight - 116; 
                } else {
                    canvas.height = window.innerHeight - 96;
                }
            }
        });
    
    });