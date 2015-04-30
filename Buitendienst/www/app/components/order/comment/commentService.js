angular.module('directory.commentService', [])

    .factory('CommentService', function (PlanningService, $q, $window) {

        return {
            setComment: function(orderid, opmerking) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.opmerking = opmerking;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getComment: function(orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.opmerking);
                return deferred.promise;
            }
        }
    });