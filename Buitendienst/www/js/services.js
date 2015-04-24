angular.module('directory.services', [])

    .factory('$localstorage', function($window, $http) {

        return {
            setActivities: function() {
                return $http.get("activities.json")
                    .success(function (response) {
                        $window.localStorage['activities'] = JSON.stringify(response);
                    })
                    .error(function () {
                        alert('ERROR: Werkzaamheden konden niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getActivities: function() {
                return JSON.parse($window.localStorage['activities'] || '{}');
            },
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
        var _signature;

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
    }])

    .filter('getSlice', function(){
        return function(input) {
            if(input.length > 20) {
                output = input.slice(0, 20) + '...';
            } else {
                output = input;
            }
            return output;
        }
    });