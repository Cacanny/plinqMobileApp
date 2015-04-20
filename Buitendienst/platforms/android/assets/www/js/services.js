angular.module('directory.services', [])

    .factory('$localstorage', function($window, $http) {

        return {
            setObject: function() {
                return $http.get("orders.json").success(function (response) {
                    $window.localStorage.clear();
                    $window.localStorage['planning'] = JSON.stringify(response);
                });
            },
            getObject: function() {
                return JSON.parse($window.localStorage['planning'] || '{}');
            },
            saveObject: function() {
                //TODO save in localstorage
            },
            postObject: function() {
                //TODO JSON request
            }
        }
    })

    .factory('PlanningService', function ($localstorage, $q) {

        var planning;

        return {
            getPlanning: function () {
                planning = $localstorage.getObject();
                var deferred = $q.defer();
                deferred.resolve(planning);
                return deferred.promise;
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