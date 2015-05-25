angular.module('directory.orderService', [])

    .factory('OrderService', function (PlanningService, $q, $window, $http, $ionicPopup) {

        var orders;
        var signature = false;
        var werkbon = false;

        return {
            getOrders: function () {
                orders = PlanningService.getPlanning();
                var deferred = $q.defer();
                deferred.resolve(orders);
                return deferred.promise;
            },

            findByOrderId: function (_orderId) {
                var deferred = $q.defer();
                for (var x = 0; x < orders.length; x++) {
                    if (orders[x].orderid == _orderId) {
                        var order = orders[x];
                        break;
                    }
                }
                deferred.resolve(order);
                return deferred.promise;
            },

            checkOrderStatus: function (orderArr) {
                var statusArr = [];
                for (var index = 0; index < orderArr.length; index += 1) {
                    var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderArr[index].orderid));
                    statusArr.push(parsedItem.status);
                }
                var deferred = $q.defer();
                deferred.resolve(statusArr);
                return deferred.promise;
            },

            checkIfFinished: function (_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if (parsedItem.status === 'Afgerond') {
                    return true;
                } else {
                    return false;
                }
            },

            setFollowup: function (orderid, text) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.vervolgactie = text;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getFollowup: function (orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.vervolgactie);
                return deferred.promise;
            },

            postOrder: function (_orderId, status) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));

                if (status !== 'Queue') {
                    if (status === 'Afgerond') {
                        parsedItem.status = 'Afgerond';
                    } else {
                        parsedItem.status = 'Vervolgactie';
                    }
                }

                $window.localStorage.setItem('order' + _orderId, JSON.stringify(parsedItem));

                return $http.post("test.json", parsedItem) // CHANGE test.json TO THE API URL
                    .success(function (response) {
                        // Success!
                        console.log(response);
                    })
                    .error(function () {
                        var alertPopup = $ionicPopup.alert({
                            title: '<b>Fout!</b>',
                            template: 'Er is iets fout gegaan bij het verzenden van de order! <br/><br/>Order ' + _orderId + ' wordt in de wachtrij gezet. Er wordt automatisch geprobeerd deze order opnieuw te verzenden (bij internetconnectie).'
                        });

                        // Add the order to the queue if it's not already in there
                        var queue = JSON.parse($window.localStorage.getItem('queue'));
                        var addToQueue = true;
                        for (var index = 0; index < queue.length; index += 1) {
                            if (queue[index] === _orderId) {
                                addToQueue = false;
                                break;
                            }
                        }

                        if (addToQueue) {
                            queue.push(_orderId);
                            $window.localStorage.setItem('queue', JSON.stringify(queue));
                        }
                    });
            },

            inQueueBool: function (_orderId) {
                var bool = false;
                var queue = JSON.parse($window.localStorage.getItem('queue'));

                for (var index = 0; index < queue.length; index += 1) {
                    if (queue[index] === _orderId) {
                        bool = true;
                        break;
                    }
                }
                var deferred = $q.defer();
                deferred.resolve(bool);
                return deferred.promise;
            },

            getOrderStatus: function (_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.status);
                return deferred.promise;
            },

            checkForSignature: function (_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if (parsedItem.handtekening.image !== '') {
                    return true;
                } else {
                    return false;
                }
            },

            setGeolocation: function (latitude, longitude) {
                var _position = {
                    latitude: latitude,
                    longitude: longitude
                }
                $window.localStorage.setItem('geoLocation', JSON.stringify(_position));
            },

            getGeolocation: function () {
                return glocation = {
                    lat: $window.localStorage.getItem('geoLocation').latitude,
                    lng: $window.localStorage.getItem('geoLocation').longitude
                }
            }


        }
    });