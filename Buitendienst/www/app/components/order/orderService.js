angular.module('directory.orderService', [])

    .factory('OrderService', function (PlanningService, $q, $window, $http) {

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

            postOrder: function () {
                //TODO JSON request
            }
        }
    });