angular.module('directory.orderService', [])

    .factory('OrderService', function ($q, $window, $http, $ionicPopup, $ionicLoading) {

        var signature = false;
        var fromPlanning = false;

        return {
            startLoadingScreen: function() {
                $ionicLoading.show({
                    template: "Order wordt geladen..."
                });
            },

            endLoadingScreen: function() {
                $ionicLoading.hide();
            },

            cameFromPlanning: function() {
                return fromPlanning;
            },

            setCameFromPlanning: function() {
                fromPlanning = true;
            },

            findByOrderId: function (_orderId) {
                var orders = JSON.parse($window.localStorage.getItem('getplanning'));
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

            getUser: function () {
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.naam);
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

            checkIfStarted: function(_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if (parsedItem.start.datum === '') {
                    return false;
                } else {
                    return true;
                }
            },

            checkIfStartedAndNotFinished: function(_orderId) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                if (parsedItem.eind.datum !== '') {
                    return false;
                } else {
                    return true;
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

            postOrder: function (_orderId, status, datum) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));
                parsedItem.verzenddatum = datum;

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
                        if(status !== 'Queue') {
                            var alertPopup = $ionicPopup.alert({
                                title: '<b>Fout!</b>',
                                template: 'Er is iets fout gegaan bij het verzenden van de order! <br/><br/>Order ' + _orderId + ' wordt in de wachtrij gezet. Er wordt automatisch geprobeerd deze order opnieuw te verzenden (bij internetconnectie).'
                            });
                        }

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

            deleteOrderFromQueue: function(_orderId) {
                var queue = JSON.parse($window.localStorage.getItem('queue'));
                var index = queue.indexOf(_orderId);
                if (index > -1) {
                    queue.splice(index, 1);
                }
                $window.localStorage.setItem('queue', JSON.stringify(queue));
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

            setGeolocation: function (latitude, longitude, destination, orderid) {
                var position = {
                    latitude: latitude,
                    longitude: longitude
                }
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem[destination].location = position;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getGeolocation: function () {
                return glocation = {
                    lat: $window.localStorage.getItem('geoLocation').latitude,
                    lng: $window.localStorage.getItem('geoLocation').longitude
                }
            },

            setOrderDate: function (orderid, dateTime, destination) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem[destination].datum = dateTime;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getOrderDate: function(_orderId, destination) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + _orderId));  
                return parsedItem[destination].datum;
            },

            setStartLocation: function (orderid, geoLocation) {
                console.log("setStartLocation :")
                console.log(geoLocation);
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.start.latitude = geoLocation.latitude;
                console.log(parsedItem);
                parsedItem.start.longitude = geoLocation.longitude;
                console.log(parsedItem);

            }
        }
    });