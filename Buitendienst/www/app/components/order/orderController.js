angular.module('directory.orderController', [])

    .controller('OrderCtrl', function ($scope, $stateParams, OrderService, $ionicModal, CompleteService) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
        });

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        $scope.sendOrder = function() {
            // Delete order from LocalStorage?

            // CHECK FOR SIGNATURE AND WERKBON -- REQUIRED

            // SET STATUS VOLTOOID
            OrderService.postOrder($scope.order.orderid);
        }

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
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Keep track of all the elements that are collapsed or not
        // True = expanded, False = collapsed
        $scope.toShowArr = [
            true, true, true, false, false, false, false
        ];

        // Toggles the state of a window to true or false
        $scope.toggle = function (index) {
            $scope.toShowArr[index] = !$scope.toShowArr[index];
        }
    });
