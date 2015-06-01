angular.module('directory.planningService', [])

    .factory('PlanningService', function ($window, $http, $q, $ionicPopup) {

        return {
            getActivities: function () {
                return JSON.parse($window.localStorage.getItem('activities') || '{}');
            },

            setInitialQueue: function () {
                if ($window.localStorage.getItem('queue') === null) {
                    $window.localStorage.setItem('queue', JSON.stringify([]));
                }
            },

            setQueue: function (queueArr) {
                $window.localStorage.setItem('queue', JSON.stringify(queueArr));
            },

            getQueue: function () {
                var parsedItem = JSON.parse($window.localStorage.getItem('queue'));
                var deferred = $q.defer();
                deferred.resolve(parsedItem);
                return deferred.promise;
            },

            setPlanning: function () {
                return $http.get("orders.json") // Change this to actual URL -> maybe add the USER to URL?
                    .success(function (response) {
                        $window.localStorage.setItem('activities', JSON.stringify(response.basis));
                        $window.localStorage.setItem('getplanning', JSON.stringify(response.orders));
                    })
                    .error(function () {
                        alert('ERROR: Planning kon niet worden opgehaald, herstart de applicatie.');
                    });
            },
            
            getPlanning: function () {
                return JSON.parse($window.localStorage.getItem('getplanning') || '{}');
            },

            createEmptyOrder: function (order, user) {
                if ($window.localStorage.getItem('order' + order.orderid) === null) {
                    var fullOrder = {
                        orderid: order.orderid,
                        start: {
                            datum: '',
                            location: {}
                        },
                        eind: {
                            datum: '',
                            location: {}
                        },
                        status: order.status,
                        vervolgactie: '',
                        verzenddatum: '',
                        werkzaamheden: [],
                        materialen: [],
                        opmerking: '',
                        fotos: [],
                        handtekening: {
                            image: '',
                            datum: '',
                            location: {}
                        },
                        monteur: user
                    }
                    // Add 'Monteur' in werkbon
                    $window.localStorage.setItem('order' + order.orderid, JSON.stringify(fullOrder));
                }
            },

            giveAlert: function(time) {
                var alertPopup = $ionicPopup.alert({
                    title: '<b>Nieuwe order!</b>',
                    template: 'Herinnering: er staat een order gepland voor <b>' + time + '</b>.'
                });
            }
        }
    });