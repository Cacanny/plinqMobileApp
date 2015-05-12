angular.module('directory.completeService', [])

    .factory('CompleteService', function ($window, $q) {

        var signaturePad;

        return {
            setSignaturePad: function(bool) {
                signaturePad = bool;
            },

            getSignaturePad: function() {
                return signaturePad;
            },

            setSignatureImage: function(orderid, signature) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.handtekening = signature;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getSignatureImage: function(orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.handtekening);
                return deferred.promise;
            }


        }
    });