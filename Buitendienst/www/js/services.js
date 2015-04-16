angular.module('directory.services', [])

    .factory('PlanningService', function ($http, $q) {

        var planning;

        return {
            getPlanning: function ($scope) {
                $http.get("orders.json")
                    .success(function (response) {
                        $scope.orders = response;
                        planning = response;
                })
            },

            findByOrderId: function (orderId) {
                var deferred = $q.defer();
                for (var x = 0; x < planning.length; x++) {
                    if (planning[x].orderid == orderId) {
                        var order = planning[x];
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