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

            findByOrderId: function (_orderId) {
                var deferred = $q.defer();
                for (var x = 0; x < orders.length; x++) {
                    if (orders[x].orderid == _orderId) {
                        var order = orders[x];
                        break;
                    }
                }
                deferred.resolve(order);
                return deferred.promise;
            },

            postOrder: function (_orderId) {
                var completeOrder = $window.localStorage.getItem('order' + _orderId);
                console.log(completeOrder);
                var data = $.param({
                    json: completeOrder
                });
                return $http.post("test.json", data)
                    .success(function (response) {
                        console.log(response);
                    })
                    .error(function () {
                        alert('ERROR: Order kon niet worden opgeslagen, probeer opnieuw.');
                    });
            }
        }
    });