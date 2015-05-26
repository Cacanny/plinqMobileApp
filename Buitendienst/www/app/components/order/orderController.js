angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal, $ionicPopup, $cordovaGeolocation) {

        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
            $scope.orderIsStarted = OrderService.checkIfStarted($scope.order.orderid);
            $scope.startTime = OrderService.getStartTime($scope.order.orderid);
            if ($scope.startTime === "") {
                $scope.startTime = "Niet gestart";
            }
            // If order is in queue, display the orderstatus different
            OrderService.inQueueBool($scope.order.orderid).then(function (bool) {
                if (bool) {
                    $scope.order.status = 'In wachtrij';
                } else {
                    $scope.disableAll();
                }
            });

        });

        // Function makes sending the order available and stores timer and geolocation
        $scope.startOrder = function () {
            var date = new Date();
            var startTime = convertTime(date);
            var startDate = convertDate(date);
            startDate = startDate +" " + startTime;
            var destination = "start";
            var geoLocation = $scope.getCurrentGeoLocation(destination, $scope.order.orderid);
            OrderService.setStartDate($scope.order.orderid, startDate);
            $scope.startTime = OrderService.getStartTime($scope.order.orderid);
            console.log($scope.startTime);
            $scope.orderIsStarted = true;
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

        $scope.getCurrentGeoLocation = function (destination, orderid) {
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

            if ($scope.orderFinished) {
                angular.element(document).ready(function () {
                    var elements = document.getElementsByClassName('removeAfterFinish');

                    for (var index = 0; index < elements.length; index += 1) {
                        elements[index].style.display = 'none';
                    }

                    var comment = document.getElementById('comment');
                    if (comment) {
                        comment.disabled = true;
                    }
                });
            }
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
                    // Check if the signature and werkbon are available
                    var signatureAvailable = OrderService.checkForSignature($scope.order.orderid);

                    if (!signatureAvailable) {
                        alertMessage = 'Het is niet mogelijk deze order te verzenden zonder een handtekening van de klant!';
                        showAlert(alertMessage, alertTitle);
                    } else {
                        // All requirements are true
                        showPopup();
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

        function showPopup() {
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
            // The actual sending of the order via the service
            OrderService.postOrder($scope.order.orderid, status).then(function (res) {
                $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);

                if (status === 'Afgerond') {
                    $scope.order.status = 'Afgerond';
                    $scope.disableAll();
                } else {
                    $scope.order.status = 'In behandeling';
                }
                showAlert(alertMessage, alertTitle);
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

                confirmPopup.then(function (res) {
                    if (res) {
                        OrderService.setFollowup($scope.order.orderid, document.getElementById('followup').value);
                        $scope.sendOrder('Vervolgactie');
                    }
                });
            });
        }

        // Ionic Modal
        $ionicModal.fromTemplateUrl('modal', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function (include) {
            $scope.include = include;
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
