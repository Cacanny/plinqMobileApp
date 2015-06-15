angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function ($scope, $rootScope, $window, CompleteService, OrderService) {
        angular.element(document).ready(function () {
            
            // $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);
            // Check if the order has been sent with the 'Afgerond' status, if so, disable the two buttons
            OrderService.inQueueBool($scope.order.orderid).then(function(bool){
                if($scope.orderFinished || !$scope.orderIsStarted && !bool) {
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
                // This is actually not from a dataURL but from a fileURL
                signaturePad.fromDataURL(signature.fileURL);
            });

            $scope.clearCanvas = function () {
                signaturePad.clear();
            }

            $scope.saveCanvas = function () {
                if(!signaturePad.isEmpty()) {

                    if($window.canvas2ImagePlugin) {
                        // This doesn't work with IonicView! Plugin is not supported, but Android with PhoneGapBuild does work
                        // TODO: test this with iOS + PGB

                        // When it's ready, overwrite the signatureObject and set it
                        $window.canvas2ImagePlugin.saveImageDataToLibrary(
                            function(_fileURL){

                                var signatureObject = {
                                    fileURL: _fileURL, name: 'order' + $scope.order.orderid + '_signature.png'
                                }

                                CompleteService.setSignatureImage($scope.order.orderid, signatureObject);
                                $rootScope.closeSignature();
                            },
                            function(err){
                                alert('Fout! Handtekening kon niet succesvol opgeslagen worden, probeer opnieuw.');
                            },
                            document.getElementById('signatureCanvas')
                        );
                    }
                   
                    var date = new Date();
                    var startDate = $scope.convertDate(date) + ' ' + $scope.convertTime(date);
                    var destination = 'handtekening';
                    $scope.setCurrentGeoLocation(destination, $scope.order.orderid);
                    OrderService.setOrderDate($scope.order.orderid, startDate, destination);
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