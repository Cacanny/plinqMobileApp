angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal, $ionicPopup) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
        });

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        $scope.checkOrder = function () {
            var signatureAvailable = OrderService.checkForSignature($scope.order.orderid);
            //var werkbonAvailable = OrderService.checkForWerkbon($scope.order.orderid);
            var werkbonAvailable = true;
            var alertMessage = '';
            var alertTitle = 'Fout!';
            // Delete order from LocalStorage?

            // SET STATUS VOLTOOID

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

        function showAlert(alertMessage, alertTitle) {
            var alertPopup = $ionicPopup.alert({
                    title: '<b>' + alertTitle + '</b>',
                    template: alertMessage
                });
        }

        function showPopup() {
          // A custom popup
            var myPopup = $ionicPopup.show({
                template: '<p>U staat op het punt de order te verzenden. Wat is de huidige status van de order?</p><br/>'
                            + '<button class="button button-full button-positive" ng-click="sendOrder(\'Afgerond\')">Volledig afgerond</button>'
                            + '<button class="button button-full button-positive" ng-click="sendOrder(\'In behandeling\')">In behandeling</button>',
                title: '<b>Order verzenden</b>',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    }]
            });

            $scope.sendOrder = function(status) {

                var alertTitle = 'Succes!';
                var alertMessage = 'Order ' + $scope.order.orderid + ' is succesvol verzonden.<br/>';

                if(status === 'Afgerond') {
                    alertMessage += 'Deze order is <b>volledig afgerond</b> en kan niet meer gewijzigd worden.';
                } else {
                    alertMessage += 'Deze order is <b>in behandeling</b> en kan nog gewijzigd worden.';
                }

                showAlert(alertMessage, alertTitle);
                myPopup.close();
            }
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
