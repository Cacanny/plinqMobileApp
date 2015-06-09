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
            signaturePad.penColor = "pink";

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
                    var startDate = $scope.convertDate(date) + " " + $scope.convertTime(date);
                    var destination = "handtekening";
                    $scope.setCurrentGeoLocation(destination, $scope.order.orderid);
                    OrderService.setOrderDate($scope.order.orderid, startDate, destination);

                    // alert(document.getElementById('signatureCanvas'));
                    // alert($window.canvas2ImagePlugin);
                    // alert(JSON.stringify($window.canvas2ImagePlugin));
                    if($window.canvas2ImagePlugin) {
                        alert('ik kom er wel in');
                        $window.canvas2ImagePlugin.saveImageDataToLibrary(
                            function(msg){
                                alert(JSON.stringify(msg));
                            },
                            function(err){
                                alert(JSON.stringify(err));
                            },
                            document.getElementById('signatureCanvas')
                        );
                    }
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

            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
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
               options.fileName = 'order' + $scope.order.orderid + '_signature_' + fileURL.substr(fileURL.lastIndexOf('/') + 1);
               options.mimeType = 'image/jpeg';
               options.chunkedMode = true;
               options.params = {};

               var ft = new FileTransfer();
               ft.upload(fileURL, encodeURI('http://isp-admin-dev.plinq.nl/upload/'), win, fail, options);
            }
        });
    
    });