angular.module('directory.orderService', [])

    .factory('OrderService', function (PlanningService, $q, $window, $http) {

        var orders;
        var signature = false;
        var werkbon = false;

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

            checkOrderStatus: function(orderArr) {
                var statusArr = [];
                for(var index = 0; index < orderArr.length; index += 1) {
                    var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderArr[index].orderid));
                    statusArr.push(parsedItem.status);
                }
                var deferred = $q.defer();
                deferred.resolve(statusArr);
                return deferred.promise;
            },

            postOrder: function (_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));

                return $http.post("test.json", parsedItem)
                    .success(function (response) {
                        parsedItem.status = 'Afgerond';
                        $window.localStorage.setItem('order' + _orderId, JSON.stringify(parsedItem));
                    })
                    .error(function () {
                        alert('ERROR: Order ' + _orderId + ' kon niet worden verzonden, probeer opnieuw.');
                    });
            }, 

            checkForSignature: function(_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if(parsedItem.handtekening !== '') {
                    return true;
                } else {
                    return false;
                }
            },

            checkForWerkbon: function(_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if(parsedItem.werkbon !== '') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    });