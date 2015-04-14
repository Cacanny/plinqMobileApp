angular.module('directory.services', [])

    .factory('PlanningService', function($http) {

        return {
            getPlanning: function($scope) {
                $http.jsonp("https://public-api.wordpress.com/rest/v1/freshly-pressed?callback=JSON_CALLBACK")
                    .success(function(response){
                    $scope.posts = response.posts;
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