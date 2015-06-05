angular.module('directory.planningController', [])

    .controller('PlanningCtrl', function ($scope, $rootScope, $timeout, $interval, $window, $ionicPlatform, $cordovaNetwork, $cordovaLocalNotification, $ionicLoading, $ionicPopup, PlanningService, OrderService, $state) {
        PlanningService.setInitialQueue();
        startNotificationInterval();

        // Some initial variables
        $scope.orders = [];
        $scope.queueLength = 0;
        $scope.updateTime = 'Nooit';
        $scope.planningAvailable = false;

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        // $window.localStorage.clear();
        // refresh();
        $scope.connection = 'Onbekend';

        $scope.$on('$ionicView.afterEnter', function(){
            $scope.planningAvailable = false;

            // Get queue
            PlanningService.getQueue().then(function(_queueArr){
                $scope.queueArr = _queueArr;
                $scope.queueLength = _queueArr.length;
                // sendQueue(); // Delete this after browser testing
            });

            checkOrderStatus();
        });
        
        $scope.viewQueue = function() {
            var template = '';
            if($scope.queueArr.length > 0) {
                var queueRow = '';
                for(var index = 0; index < $scope.queueArr.length; index += 1) {
                    queueRow += '<ion-item>' + $scope.queueArr[index] + '</ion-item>';
                }
                template = 'De volgende <b>' + $scope.queueLength + '</b> orders worden bij internetconnectie <b>automatisch</b> verzonden:<br/><br/>' +
                            '<ion-list>' + queueRow + '</ion-list>';
            } else {
                template = 'Er zijn geen orders in afwachting van verzending.';
            }

            var alertPopup = $ionicPopup.alert({
                title: '<b>Wachtrij voor verzending</b>',
                template: template
            });
        }

        function sendQueue() {
            if($scope.queueArr.length > 0) {
                var date = new Date();
                var datum = convertDate(date) + " " + convertTime(date);

                // Foreach order in the queue send it, and remove it from the queue
                for(var index = $scope.queueArr.length - 1; index >= 0; index -= 1) {
                    OrderService.postOrder($scope.queueArr[index], 'Queue', datum).then(function(res){
                        $scope.queueArr.splice(index, 1);
                        $scope.queueLength = $scope.queueArr.length;
                        PlanningService.setQueue($scope.queueArr);
                        checkOrderStatus();

                        console.log(res);
                    });
              }
            } else {
                $interval.cancel($scope.intervalQueue);
            }
        } 

        function refreshAllIntervals() {
            // Try to send orders in the queue if there is any every 15 seconds
            $scope.intervalQueue = $interval(function(){
                if($scope.queueArr.length > 0) {
                    sendQueue();
                }
            }, 15000);
        }   

        // Get initial Internet Connection
        $scope.$on('$ionicView.afterEnter', function(){
            document.addEventListener("deviceready", function () {
                if(navigator.connection.type !== Connection.NONE){

                    // Only when the application is first started
                    if(!$scope.planningAvailable) {
                        // Get the planning and werkzaamheden/materialen
                        refresh();

                        $scope.planningAvailable = true;
                    }

                    performOnlineFunction();
                } else {
                    performOfflineFunction();
                }
            });
        });

        $scope.$on('$ionicView.beforeLeave', function(){
            // Stop all possible intervals
            $interval.cancel($scope.intervalQueue);
            $interval.cancel($scope.highlightInterval);

            // Tell the orderview that he came from the planningview
            OrderService.setCameFromPlanning();
        });

        $scope.$on('$ionicView.afterLeave', function(){
            // Extra check to stop all possible intervals
            $interval.cancel($scope.intervalQueue);
            $interval.cancel($scope.highlightInterval);
        });

        // Function that needs to be performed with Online connection
        function performOnlineFunction() {
            $scope.connection = 'Online';

            // Initial intervals
            refreshAllIntervals();
        }

        // Function that needs to be performed with Offline connection
        function performOfflineFunction() {
            $scope.connection = 'Offline';

            // Stop all possible intervals
            $interval.cancel($scope.intervalQueue);
        }

        // Watch if the Internet Connection changes 
        $ionicPlatform.ready(function () {
            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                performOnlineFunction();
            });

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                performOfflineFunction();
            });
        }, false);

        function checkQueueStatus(_orderId) {
            OrderService.inQueueBool(_orderId).then(function(bool){
                if(bool){
                    for(var index = 0; index < $scope.orders.length; index += 1) {
                        if($scope.orders[index].orderid === _orderId) {
                            $scope.orders[index].status = 'In wachtrij';
                            break;
                        }
                    } 
                }
            });
        }

        function checkOrderStatus() {
            // Check if the status has been updated in LocalStorage ('orderXXX')
            OrderService.checkOrderStatus($scope.orders).then(function(statusArr){
                for(var index = 0; index < $scope.orders.length; index += 1) {
                    if(statusArr[index] === 'Vervolgactie') {
                        $scope.orders[index].status = 'In behandeling';
                    } else {
                        $scope.orders[index].status = statusArr[index];
                    }

                    checkQueueStatus($scope.orders[index].orderid);
                }
            });        
        }

        function getAll() {
            PlanningService.getPlanning().then(function (orders) {
                OrderService.getUser().then(function(user){
                    // Fill $scope.orders with the orders from the LocalStorage ('getplanning')
                    $scope.orders = orders;
                    setupLocalStorage(orders, user);  

                    checkOrderStatus();

                    highlightOrder();

                    $scope.highlightInterval = $interval(function(){
                        highlightOrder();
                    }, 60000);

                    deleteOrdersOlderThanOneDay();

                });
            });
        }

        // Delete the created orders (made at function setupLocalStorage) the next day
        // Since 'getplanning' will only contain orders in the future, we can compare the 'getplanning' orders with the orders created in LS,
        // and delete orders which are not in the 'getplanning'
        function deleteOrdersOlderThanOneDay() {
             var deleteOrder = false;
             PlanningService.getCreatedLocalStorageOrders().then(function(orderArr){
                for(var index = 0; index < orderArr.length; index += 1){
                    
                    var orderIsAvailableInGetPlanning = false;
                    for(var x = 0; x < $scope.orders.length; x += 1) {
                        if(orderArr[index] === $scope.orders[x].orderid) {
                            orderIsAvailableInGetPlanning = true;
                        }
                    }
                    if(!orderIsAvailableInGetPlanning){
                        PlanningService.deleteOrderFromLocalStorage(orderArr[index]);
                    }
                }
             });

        }

        // Create some empty keys in localStorage for all the orders
        function setupLocalStorage(orders, user) {
            for(var i = 0; i < orders.length; i += 1) {
                PlanningService.createEmptyOrder(orders[i], user);
            }
        }  

        // Start the interval to check every 1 minute if it is 15 minutes before a scheduled order
        function startNotificationInterval() {
            var intervalNotification = $interval(function(){
                var date = convertDate(new Date()); // dd-MM-jjjj
                var now = convertTime(new Date()); // HH:mm
                var orderTime = convertTime(getAlertTime(new Date(new Date().toDateString() + ' ' + $scope.orders[2].tijd), 15)); // HH:mm (15 minutes before order time)
                
                for(var index = 0; index < $scope.orders.length; index += 1){
                    if(orderTime === now && $scope.orders[index].plandatum === date) {
                        PlanningService.giveAlert($scope.orders[index].tijd);
                    }
                }
            }, 60000);
        }

        $scope.$on('$ionicView.afterEnter', function(){
            if($scope.orders) {
                highlightOrder();

                $scope.highlightInterval = $interval(function(){
                    highlightOrder();
                }, 60000);
            }
        });

        // When it's time for a order, highlight it!
        function highlightOrder() {
            angular.element(document).ready(function () {
                var date = convertDate(new Date()); // dd-MM-jjjj
                var now = convertTime(new Date()); // HH:mm
                
                for(var index = 0; index < $scope.orders.length; index += 1){
                    var nextOrderTime;

                    // As long as the current time is between the time of the previous and next order
                    if(!$scope.orders[index+1]){
                        nextOrderTime = '23:59'
                    } else {
                        nextOrderTime = $scope.orders[index+1].tijd;
                    }

                    var orderId = $scope.orders[index].orderid;   
                    if($scope.orders[index].tijd <= now && nextOrderTime > now && $scope.orders[index].plandatum === date) {         
                        // And add the highlight to the order
                        document.getElementById(orderId).className = "card orderHighlight";
                    } else {
                        // Reset the className
                        document.getElementById(orderId).className = "card orderWithoutHighlight";
                    }
                }
            });
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

            // Update time
            var date = new Date();
            $scope.date = convertDate(date);
            $scope.updateTime = convertTime(date);
        }

        $scope.refresh = function() {
            refresh();
        }

        // Navigate to other state using ng-click
        $scope.details = function (id) {
            // Give a loading screenm  
            OrderService.startLoadingScreen();
            $timeout(function(){
                $state.go('app.order', { orderId: id });
            }, 50);
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

        function getAlertTime(date, minutes) {
            return new Date(date.getTime() - minutes*60000);
        }

    });