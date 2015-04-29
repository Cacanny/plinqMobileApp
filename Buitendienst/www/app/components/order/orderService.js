angular.module('directory.orderService', [])

    .factory('OrderService', function (PlanningService, $q) {

        var orders;
        var _signature;

        return {
            getOrders: function () {
                orders = PlanningService.getPlanning();
                var deferred = $q.defer();
                deferred.resolve(orders);
                return deferred.promise;
            },

            findByOrderId: function (orderId) {
                var deferred = $q.defer();
                for (var x = 0; x < orders.length; x++) {
                    if (orders[x].orderid == orderId) {
                        var order = orders[x];
                        break;
                    }
                }
                deferred.resolve(order);
                return deferred.promise;
            },

            saveOrder: function () {
                //TODO save in localstorage
            },
            postOrder: function () {
                //TODO JSON request
            },

            // Getter for the Image from the Signature Pad
            getSignatureImage: function () {
                return _signature;
            },

            // Setter for the Image from the Signature Pad
            setSignatureImage: function (signature) {
                _signature = signature;
            }


        }
    });