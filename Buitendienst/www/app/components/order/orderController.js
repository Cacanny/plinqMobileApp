angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal, $ionicPopup) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
        });

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        $scope.checkOrder = function () {
            // First check if the order already had been sent with the 'Afgerond' status
            var orderFinished = OrderService.checkIfFinished($scope.order.orderid);

            var alertMessage = '';
            var alertTitle = 'Fout!';

            if(orderFinished) {
                alertMessage = 'Deze order is al <b>volledig afgerond</b>, het is niet mogelijk deze order nogmaals te verzenden!';
                showAlert(alertMessage, alertTitle);
            } else {
                // Check if the signature and werkbon are available
                var signatureAvailable = OrderService.checkForSignature($scope.order.orderid);
                var werkbonAvailable = OrderService.checkForWerkbon($scope.order.orderid);

                if(!signatureAvailable && !werkbonAvailable) {
                    alertMessage = 'Het is niet mogelijk deze order te verzenden zonder een ingevulde werkbon of handtekening van de klant!';
                    showAlert(alertMessage, alertTitle);
                } else if(!signatureAvailable && werkbonAvailable) {
                    alertMessage = 'Het is niet mogelijk deze order te verzenden zonder een handtekening van de klant!';
                    showAlert(alertMessage, alertTitle);
                } else if(signatureAvailable && !werkbonAvailable) {
                    alertMessage = 'Het is niet mogelijk deze order te verzenden zonder een ingevulde werkbon!';
                    showAlert(alertMessage, alertTitle);
                } else {
                    // All requirements are true
                    showPopup();
                }
            }
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
                            + '<button class="button button-full button-positive" ng-click="sendOrder(\'Afgerond\')">Afgerond</button>'
                            + '<button class="button button-full button-positive" ng-click="sendOrder(\'Vervolgactie\')">Vervolgactie</button>',
                title: '<b>Order verzenden</b>',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    }]
            });
        }

        $scope.sendOrder = function(status) {
            //TODO: Delete order from LocalStorage?
            var alertTitle = 'Succes!';
            var alertMessage = 'Order ' + $scope.order.orderid + ' is succesvol verzonden.<br/>';

            if(status === 'Afgerond') {
                alertMessage += '<br/>Deze order is <b>volledig afgerond</b> en kan niet meer gewijzigd worden.';
            } else {
                alertMessage += '<br/>Deze order is <b>in behandeling</b> en kan nog gewijzigd worden.';
            }
            myPopup.close();

            // The actual sending of the order via the service
            OrderService.postOrder($scope.order.orderid, status).then(function(res){
                if(status === 'Afgerond') {
                    $scope.order.status = 'Afgerond';
                } else {
                    $scope.order.status = 'In behandeling';
                }
                showAlert(alertMessage, alertTitle);
                console.log(res);
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
            true, true, true, false, false, false, false, false
        ];

        // Toggles the state of a window to true or false
        $scope.toggle = function (index) {
            $scope.toShowArr[index] = !$scope.toShowArr[index];
        }
    });
