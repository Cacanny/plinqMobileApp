angular.module('directory.signatureController', [])

    .controller('SignatureCtrl', function ($scope, $window, CompleteService, OrderService) {
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
                signaturePad.fromDataURL(signature.dataURL);
            });

            $scope.clearCanvas = function () {
                signaturePad.clear();
            }

            $scope.saveCanvas = function () {
                if(!signaturePad.isEmpty()) {
                    var sigImg = signaturePad.toDataURL();

                    if($window.canvas2ImagePlugin) {
                        // This doesn't work with IonicView! Plugin is not supported, but Android with PhoneGapBuild does work
                        // TODO: test this with iOS PGB
                        $window.canvas2ImagePlugin.saveImageDataToLibrary(
                            function(_fileURL){

                                var signatureObject = {
                                    dataURL: signaturePad.toDataURL(), fileURL: _fileURL
                                }

                                CompleteService.setSignatureImage($scope.order.orderid, signatureObject);
                            },
                            function(err){
                                alert('Fout! Handtekening kon niet succesvol opgeslagen worden, probeer opnieuw.');
                            },
                            document.getElementById('signatureCanvas')
                        );
                    }
                    // CompleteService.setSignatureImage($scope.order.orderid, sigImg);
                   
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

            function uploadPicture(fileURL) {
                // console.log(fileURL);
               var win = function (result) {
                   alert('Succes! ' + JSON.stringify(result));
               }

               var fail = function (err) {
                   alert("Fail! " + JSON.stringify(err));
               }

               var options = new FileUploadOptions();
               options.fileKey = 'file';
               options.fileName = 'order' + $scope.order.orderid + '_signature.png';
               options.mimeType = 'image/jpeg';
               options.chunkedMode = true;
               options.params = {};

               var ft = new FileTransfer();
               ft.upload(fileURL, encodeURI('http://isp-admin-dev.plinq.nl/upload/'), win, fail, options);
            }
        });
    
    });