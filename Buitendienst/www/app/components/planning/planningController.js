angular.module('directory.planningController', [])

    .controller('PlanningCtrl', function ($scope, $rootScope, $window, $cordovaNetwork, $cordovaLocalNotification, $ionicLoading, PlanningService, OrderService, $state) {
        // Some initial variables
        $scope.orders = [];

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        // $window.localStorage.clear();
        refresh();
        $scope.connection = 'Online';

        // Watch if the Internet Connection changes 
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $scope.connection = 'Online';

            // Get the planning and werkzaamheden/materialen
            refresh(); // TODO EVERY X seconds!!!!!
            //TODO: give a message like: 'Planning succesvol opgehaald op: <datumtijd>'
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $scope.connection = 'Offline';
        });

        // Fill $scope.orders with the orders from the LocalStorage 
        function getAll() {
            OrderService.getOrders().then(function (orders) {
                $scope.orders = orders;
                setupLocalStorage(orders);   

                OrderService.checkOrderStatus(orders).then(function(statusArr){
                    for(var index = 0; index < $scope.orders.length; index += 1) {
                        if(statusArr[index] !== ''){
                            if(statusArr[index] === 'Vervolgactie') {
                                $scope.orders[index].status = 'In behandeling';
                            } else {
                                $scope.orders[index].status = statusArr[index];
                            }
                        }
                    }
                });
            });
        }

        // Create some empty keys in localStorage for all the orders
        function setupLocalStorage(orders) {
            for(var i = 0; i < orders.length; i += 1) {
                PlanningService.createEmptyOrder(orders[i]);
            }
        }

        // Refresh to get the new JSON files
        function refresh() {
            // setPlanning will call the JSON file, if it takes some time, then a loading screen will appear 
            $ionicLoading.show({
                template: "<ion-spinner icon='android'></ion-spinner><br/> Actuele planning wordt opgehaald..."
            });
            PlanningService.setPlanning().then(function () {
                // Get the orders
                getAll();

                $ionicLoading.hide();
            });

            // Get the 'werkzaamheden' and the 'materialen' 
            PlanningService.setActivities();
        }

        $scope.refresh = function() {
            refresh();
        }

        // Navigate to other state using ng-click
        $scope.details = function (id) {
            $state.go('app.order', { orderId: id });
        }

        // Get the current date and convert it to dd-mm-yyyy format
        var date = new Date();
        $scope.date = convertDate(date);
        $scope.time = convertTime(date);

        function convertTime(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getHours()), pad(d.getMinutes())].join(':');
        }

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }

        $scope.add = function() {
            var now = new Date().getTime();
            var _10SecondsFromNow = new Date(now + 10 * 1000);
            alert('daar gaan we ' + _10SecondsFromNow);
            $cordovaLocalNotification.add({
                id: "1234",
                at: _10SecondsFromNow,
                message: "This is a message",
                title: "This is a title"
            }).then(function () {
                alert("The notification has been set");
            });
        };
 
        $scope.isScheduled = function() {
            $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                alert("Notification 1234 Scheduled: " + isScheduled);
            });
        }

        $scope.$on("$cordovaLocalNotification:schedule", function(id, state, json) {
            alert("Added a notification");
        });

    });