angular.module('planningService', [])

    .factory('PlanningService', function ($window, $http) {

        return {
            setActivities: function () {
                return $http.get("activities.json")
                    .success(function (response) {
                        $window.localStorage['activities'] = JSON.stringify(response);
                    })
                    .error(function () {
                        alert('ERROR: Werkzaamheden konden niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getActivities: function () {
                return JSON.parse($window.localStorage['activities'] || '{}');
            },
            setPlanning: function () {
                return $http.get("orders.json")
                    .success(function (response) {
                        $window.localStorage['getplanning'] = JSON.stringify(response);
                    })
                    .error(function () {
                        alert('ERROR: Planning kon niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getPlanning: function () {
                return JSON.parse($window.localStorage['getplanning'] || '{}');
            },
            savePlanning: function () {
                //TODO save in localstorage
            },
            postPlanning: function () {
                //TODO JSON request
            }
        }
    })