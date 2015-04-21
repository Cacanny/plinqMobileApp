angular.module('directory.services', [])

    .factory('$localstorage', function($window, $http) {

        return {
            setPlanning: function() {
                return $http.get("orders.json")
                    .success(function (response) {
                        $window.localStorage['planning'] = JSON.stringify(response);
                    })
                    .error(function() {
                        alert('ERROR: Planning kon niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getPlanning: function() {
                return JSON.parse($window.localStorage['planning'] || '{}');
            },
            savePlanning: function() {
                //TODO save in localstorage
            },
            postPlanning: function() {
                //TODO JSON request
            }
        }
    })

    .factory('OrderService', function ($localstorage, $q) {

        var orders;

        return {
            getOrders: function () {
                orders = $localstorage.getPlanning();
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
            }
        }
    })


    .factory('Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);