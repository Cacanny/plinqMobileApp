angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal, $ionicPopup) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
        });

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        $scope.sendOrder = function () {
            var signatureAvailable = OrderService.checkForSignature($scope.order.orderid);
            //var werkbonAvailable = OrderService.checkForWerkbon($scope.order.orderid);
            var werkbonAvailable = true;
            var alertMessage = '';
            var alertTitle = 'Fout!';
            // Delete order from LocalStorage?

            // CHECK FOR SIGNATURE AND WERKBON -- REQUIRED

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
                OrderService.postOrder($scope.order.orderid).then(function(response){
                    alertMessage = 'Order ' + $scope.order.orderid + ' is succesvol verzonden.';
                    alertTitle = 'Succes!';
                    showAlert(alertMessage, alertTitle);
                    console.log(response);
                });
            }
        }

        function showAlert(alertMessage, alertTitle) {
            var alertPopup = $ionicPopup.alert({
                    title: '<b>' + alertTitle + '</b>',
                    template: alertMessage
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
