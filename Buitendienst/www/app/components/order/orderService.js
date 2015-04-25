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


            // Getter for the Image from the Signature Pad
            getSignatureImage: function () {
                return _signature;
            },

            // Setter for the Image from the Signature Pad
            setSignatureImage: function (signature) {
                _signature = signature;
            }


        }
    })


    .filter('getSlice', function () {
        return function (input) {
            if (input.length > 20) {
                output = input.slice(0, 20) + '...';
            } else {
                output = input;
            }
            return output;
        }
    })

    .service('SplitArrayService', function () {
        return {
            SplitArray: function (array, columns) {
                if (array.length <= columns) {
                    return [array];
                };

                var rowsNum = Math.ceil(array.length / columns);

                var rowsArray = new Array(rowsNum);

                for (var i = 0; i < rowsNum; i++) {
                    var columnsArray = new Array(columns);
                    for (j = 0; j < columns; j++) {
                        var index = i * columns + j;

                        if (index < array.length) {
                            columnsArray[j] = array[index];
                        } else {
                            break;
                        }
                    }
                    rowsArray[i] = columnsArray;
                }
                return rowsArray;
            }
        }
    });