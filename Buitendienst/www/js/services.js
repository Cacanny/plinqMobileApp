angular.module('directory.services', [])

    .factory('PlanningService', function($http) {

        return {
            getPlanning: function($scope) {
                $http.get("orders.json")
                    .success(function(response){
                    $scope.orders = response;

                })
            }
        }
    })

    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);