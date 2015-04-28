angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
            $scope.showTickets = true;
            if (JSON.stringify($scope.order.ticket) === '{}') {
                $scope.showTickets = false;
            }
        });

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        // Ionic Modal
        $ionicModal.fromTemplateUrl('modal', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function (include, $event) {
            $event.stopPropagation();
            $scope.include = include;
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope._signatureImage = OrderService.getSignatureImage();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Keep track of all the elements that are collapsed or not
        // True = expanded, False = collapsed
        $scope.toShowArr = [
            true, true, true, false, false, false, false, false, false
        ];

        // Toggles the state of a window to true or false
        $scope.toggle = function (index) {
            $scope.toShowArr[index] = !$scope.toShowArr[index];
        };
    })
