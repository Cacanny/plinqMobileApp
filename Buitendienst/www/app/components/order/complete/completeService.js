angular.module('directory.completeService', [])

    .factory('CompleteService', function ($window, $q) {

        var _signature;

        return {
            // Getter for the Image from the Signature Pad
            // getSignatureImage: function () {
            //     return _signature;
            // },

            // // Setter for the Image from the Signature Pad
            // setSignatureImage: function (signature) {
            //     _signature = signature;
            // }

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
            },


        }
    });