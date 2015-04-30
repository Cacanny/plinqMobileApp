angular.module('directory.planningService', [])

    .factory('PlanningService', function ($window, $http) {

        return {
            setActivities: function () {
                return $http.get("activities.json")
                    .success(function (response) {
                        $window.localStorage.setItem('activities', JSON.stringify(response));
                    })
                    .error(function () {
                        alert('ERROR: Werkzaamheden konden niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getActivities: function () {
                return JSON.parse($window.localStorage.getItem('activities') || '{}');
            },
            
            setPlanning: function () {
                return $http.get("orders.json")
                    .success(function (response) {
                        $window.localStorage.setItem('getplanning', JSON.stringify(response));
                    })
                    .error(function () {
                        alert('ERROR: Planning kon niet worden opgehaald, herstart de applicatie.');
                    });
            },
            getPlanning: function () {
                return JSON.parse($window.localStorage.getItem('getplanning') || '{}');
            },
            createEmptyOrder: function(order) {
                if($window.localStorage.getItem('order' + order.orderid) === null) {
                    var fullOrder = {
                        orderid: order.orderid,
                        status: 'In behandeling',
                        klant: '',
                        werkzaamheden: [],
                        materialen: [],
                        opmerking: '',
                        fotos: [],
                        werkbon: '',
                        handtekening: ''
                    }
                    $window.localStorage.setItem('order' + order.orderid, JSON.stringify(fullOrder));
                }
            }
        }
    });