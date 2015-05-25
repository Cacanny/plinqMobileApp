angular.module('directory.completeService', [])

    .factory('CompleteService', function ($window, $q) {

        var _canvas;

        return {
            setSignatureImage: function(orderid, signature) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.handtekening.image = signature;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getSignatureImage: function(orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.handtekening.image);
                return deferred.promise;
            },

            setCanvas: function(canvas) {
                _canvas = canvas;
            },

            getCanvas: function() {
                return _canvas;
            }


        }
    });