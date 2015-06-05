angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $timeout, $window, $stateParams, OrderService, PhotoService, $ionicModal, $ionicPlatform, $ionicPopup, $cordovaGeolocation) {
        $scope.$on('$ionicView.afterEnter', function () {
            OrderService.endLoadingScreen();

            if (!OrderService.cameFromPlanning()) {
                $window.location.replace('#/login');
            }
        });

        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;

            $scope.orderIsStarted = OrderService.checkIfStarted($scope.order.orderid);
            $scope.orderState = OrderService.checkIfStartedAndNotFinished($scope.order.orderid);
            $scope.startTime = OrderService.getOrderDate($scope.order.orderid, 'start');
            $scope.endTime = OrderService.getOrderDate($scope.order.orderid, 'eind');

            if (!$scope.orderIsStarted) {
                $scope.startTime = "Niet gestart";
                $scope.disableAll();
            }

            // If order is in queue, display the orderstatus different
            OrderService.inQueueBool($scope.order.orderid).then(function (bool) {
                if (bool) {
                    $scope.order.status = 'In wachtrij';
                } else {
                    $scope.disableAll();
                }
            });

            calculateWorkedHours();
        });

        // Function makes sending the order available and stores timer and geolocation
        $scope.startOrder = function () {
            $scope.enableAll();
            var date = new Date();
            var startDate = $scope.convertDate(date) + ' ' + $scope.convertTime(date);
            var destination = 'start';
            $scope.setCurrentGeoLocation(destination, $scope.order.orderid);

            OrderService.setOrderDate($scope.order.orderid, startDate, destination);
            $scope.startTime = OrderService.getOrderDate($scope.order.orderid, destination);
            $scope.orderIsStarted = true;
        }

        $scope.endOrder = function () {
            var date = new Date();
            var endDate = $scope.convertDate(date) + ' ' + $scope.convertTime(date);
            var destination = 'eind';
            $scope.setCurrentGeoLocation(destination, $scope.order.orderid);

            OrderService.setOrderDate($scope.order.orderid, endDate, destination);
            $scope.endTime = OrderService.getOrderDate($scope.order.orderid, destination);
            $scope.orderState = false;

            calculateWorkedHours();
        }

        function calculateWorkedHours() {
            var startTime = OrderService.getOrderDate($scope.order.orderid, 'start');
            var endTime = OrderService.getOrderDate($scope.order.orderid, 'eind');

            if (startTime && endTime) {
                var start = startTime.substring(startTime.indexOf(' ') + 1)
                var end = endTime.substring(endTime.indexOf(' ') + 1)

                var startDate = new Date(new Date().toDateString() + ' ' + start);
                var endDate = new Date(new Date().toDateString() + ' ' + end);

                var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                var diffMins = Math.ceil(timeDiff / (1000 * 60));

                var totalHours = 0;
                var totalMinutes = diffMins;

                while ((totalMinutes - 60) >= 0) {
                    totalHours++
                    totalMinutes -= 60;
                }

                $scope.workedHours = totalHours + ' uur, ' + totalMinutes + ' minuten';

            } else {
                $scope.workedHours = '0 uur, 0 minuten';
            }
        }

        $scope.convertTime = function (inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getHours()), pad(d.getMinutes())].join(':');
        }

        $scope.convertDate = function (inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }

        $scope.setCurrentGeoLocation = function (destination, orderid) {
            $cordovaGeolocation
                .getCurrentPosition()
                .then(function (position) {
                    OrderService.setGeolocation(position.coords.latitude, position.coords.longitude, destination, orderid);
                }, function (err) {
                    console.log("The following error occured while trying to get the geoLocation: ");
                    console.log(err);
                });
        }

        $scope.disableAll = function () {
            // Check if the order has been sent with the 'Afgerond' status, if so, disable everything
            $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);

            if ($scope.orderFinished || !$scope.orderIsStarted) {
                angular.element(document).ready(function () {
                    $timeout(function () {
                        var elements = document.getElementsByClassName('removeAfterFinish');
                        for (var index = 0; index < elements.length; index += 1) {
                            elements[index].style.display = 'none';
                        }

                        var comment = document.getElementById('comment');
                        if (comment) {
                            comment.disabled = true;
                        }
                    }, 100);
                });
            }
        }

        $scope.enableAll = function () {
            angular.element(document).ready(function () {
                var elements = document.getElementsByClassName('removeAfterFinish');

                for (var index = 0; index < elements.length; index += 1) {
                    elements[index].style.display = '';
                }

                var comment = document.getElementById('comment');
                if (comment) {
                    comment.disabled = false;
                }
            });
        }

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        $scope.checkOrder = function () {

            var alertMessage = '';
            var alertTitle = 'Fout!';

            OrderService.inQueueBool($scope.order.orderid).then(function (bool) {
                if ($scope.orderFinished && !bool) {
                    alertMessage = 'Deze order is al <b>volledig afgerond</b>, het is niet mogelijk deze order nogmaals te verzenden!';
                    showAlert(alertMessage, alertTitle);
                } else {
                    // Check if the signature is available
                    var signatureAvailable = OrderService.checkForSignature($scope.order.orderid);

                    if (!signatureAvailable) {
                        alertMessage = 'Het is niet mogelijk deze order te verzenden zonder een handtekening van de klant!';
                        showAlert(alertMessage, alertTitle);
                    } else {
                        chooseOrderStatus();
                    }
                }
            });
        }


        function showAlert(alertMessage, alertTitle) {
            var alertPopup = $ionicPopup.alert({
                title: '<b>' + alertTitle + '</b>',
                template: alertMessage
            });
        }

        var myPopup;

        function chooseOrderStatus() {
            // A custom popup
            myPopup = $ionicPopup.show({
                template: '<p>U staat op het punt de order te verzenden. Welke status wilt u de order meegeven?</p><br/>'
                            + '<button class="button button-full button-positive" ng-click="askConfirmation()">Afgerond</button>'
                            + '<button class="button button-full button-positive" ng-click="addFollowup()">Vervolgactie</button>',
                title: '<b>Order verzenden</b>',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    }]
            });
        }

        $scope.sendOrder = function (status) {
            myPopup.close();
            //TODO: Delete order from LocalStorage?

            var alertTitle = 'Succes!';
            var alertMessage = 'Order ' + $scope.order.orderid + ' is succesvol verzonden.<br/>';

            if (status === 'Afgerond') {
                alertMessage += '<br/>Deze order is <b>volledig afgerond</b> en kan niet meer gewijzigd of verstuurd worden.';
            } else {
                OrderService.getFollowup($scope.order.orderid).then(function (text) {
                    alertMessage += '<br/>Vervolgactie: ' + text + '<br/>';
                    alertMessage += '<br/>Deze order is <b>in behandeling</b> en kan nog gewijzigd en opnieuw verstuurd worden.';
                })
            }

            $scope.order.status = 'In wachtrij';
            $scope.endOrder();
            alert("Ik ga nu uploaden zometween, nu nog in de sendorder functie");
            $scope.uploadPicturesQueue();

            var date = new Date();
            var datum = $scope.convertDate(date) + " " + $scope.convertTime(date);

            // The actual sending of the order via the service
            OrderService.postOrder($scope.order.orderid, status, datum).then(function (res) {
                $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid); //true

                if (status === 'Afgerond') {
                    $scope.order.status = 'Afgerond';
                    $scope.disableAll();
                } else {
                    $scope.order.status = 'In behandeling';
                }
                showAlert(alertMessage, alertTitle);

                // If order was in queue also, delete it from queue.
                OrderService.inQueueBool($scope.order.orderid).then(function(bool){
                    if(bool){
                        OrderService.deleteOrderFromQueue($scope.order.orderid);
                    }
                });

                console.log(res);
            });
        }

        $scope.askConfirmation = function () {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Afronding</b>',
                template: 'Weet u zeker dat u de order wilt afronden? Het is daarna <b>niet</b> meer mogelijk de order te wijzigen of opnieuw te verzenden!'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $scope.sendOrder('Afgerond');
                }
            });
        }

        $scope.addFollowup = function () {
            OrderService.getFollowup($scope.order.orderid).then(function (text) {
                // A custom popup
                var myPopup = $ionicPopup.confirm({
                    title: '<b>Vervolgactie</b>',
                    template: 'Voer een vervolgactie in:<br/>'
                                + '<div class="item item-input">'
                                + '<textarea id="followup" rows="8">' + text + '</textarea>'
                                + '</div>',
                    buttons: [
                          { text: 'Cancel' },
                          {
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function (e) {
                                  if (!document.getElementById('followup').value) {
                                      //don't allow the user to close unless he enters a 'vervolgactie'
                                      e.preventDefault();
                                  } else {
                                      OrderService.setFollowup($scope.order.orderid, document.getElementById('followup').value);
                                      $scope.sendOrder('Vervolgactie');
                                  }
                              }
                          }
                    ]
                });
            });
        }

        // Function that uploads a fileURL to a certain address, this time it's a queue with an array full of images.
        $scope.uploadPicturesQueue = function () {
            alert("Ik ben nu in de uploadpicturesQueue function");

            var photoQueue = [];

            PhotoService.getPhotoImage($scope.order.orderid).then(function (photos) {
                alert("IK heb wat opgehaald uit de Photoservice");
                try {
                    photoQueue = photos;
                } catch(e){
                    alert("Fout!" + e);
                }
                
            });

            alert(JSON.stringify(photoQueue));

            for (i = 0; i < photoQueue.length; i++) {
                //uploadImage(photoQueue[i]);
                alert(photoQueue[i]);
            }


            //function uploadPicture(fileURL) {
            //    var win = function (result) {
            //        alert('Succes! ' + JSON.stringify(result));
            //    }

            //    var fail = function (err) {
            //        alert("Fail!");
            //    }

            //    var options = new FileUploadOptions();
            //    options.fileKey = 'image';
            //    options.fileName = 'order' + $scope.order.orderid + '_' + fileURL.substr(fileURL.lastIndexOf('/') + 1);
            //    options.mimeType = 'image/jpeg';
            //    options.chunkedMode = true;
            //    options.params = {};

            //    var ft = new FileTransfer();
            //    ft.upload(fileURL, encodeURI('http://isp-admin-dev.plinq.nl/upload/'), win, fail, options);
            //}
        }

        // Ionic Modal
        $ionicModal.fromTemplateUrl('modal', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function (_include) {
            $scope.include = _include;
            $scope.modal.show();
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Keep track of all the elements that are collapsed or not
        // True = expanded, False = collapsed
        $scope.toShowArr = [
            true, true, true, false, false, false, false, false, true
        ];

        // Toggles the state of a window to true or false
        $scope.toggle = function (index) {
            $scope.toShowArr[index] = !$scope.toShowArr[index];
        }
    });
