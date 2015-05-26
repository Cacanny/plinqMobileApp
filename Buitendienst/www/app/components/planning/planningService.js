angular.module('directory.planningService', [])

    .factory('PlanningService', function ($window, $http, $q, $ionicPopup) {

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
            createEmptyOrder: function (order) {
                if ($window.localStorage.getItem('order' + order.orderid) === null) {
                    var fullOrder = {
                        orderid: order.orderid,
                        start: {
                            datum: '',
                            location: {}
                        },
                        eind: {
                            datum: '',
                            lat: '',
                            long: ''
                        },
                        status: order.status,
                        vervolgactie: '',
                        verzenddatum: '',
                        klant: '',
                        werkzaamheden: [],
                        materialen: [],
                        opmerking: '',
                        fotos: [],
                        werkbon: '',
                        handtekening: {
                            image: '',
                            datum: '',
                            location: {}
                        },
                        verzenddatum: '',
                        vervolgactie: '',
                        monteur: 'Arno',
                        werkbon: ''
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