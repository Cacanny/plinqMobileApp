angular.module('directory.planningController', [])

    .controller('PlanningCtrl', function ($scope, $rootScope, $interval, $window, $ionicPlatform, $cordovaNetwork, $cordovaLocalNotification, $ionicLoading, $ionicPopup, PlanningService, OrderService, $state) {
        PlanningService.setInitialQueue();
        startNotificationInterval();

        // Some initial variables
        $scope.orders = [];
        $scope.queueLength = 0;
        $scope.updateTime = 'Nooit'

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        // $window.localStorage.clear();
        refresh();
        $scope.connection = 'Online';

        $scope.$on('$ionicView.afterEnter', function(){
            // Get queue
            PlanningService.getQueue().then(function(_queueArr){
                $scope.queueArr = _queueArr;
                $scope.queueLength = _queueArr.length;
                sendQueue(); // Delete this after browser testing
            });
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
                // Foreach order in the queue send it, and remove it from the queue
                for(var index = $scope.queueArr.length - 1; index >= 0; index -= 1) {
                    OrderService.postOrder($scope.queueArr[index], 'Queue').then(function(res){
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
            // Update the planning and werkzaamheden/materialen every 30 seconds.
            $scope.intervalRefresh = $interval(function(){
                refresh();
            }, 30000);

            // Try to send orders in the queue if there is any
            $scope.intervalQueue = $interval(function(){
                if($scope.queueArr.length > 0) {
                    sendQueue();
                }
            }, 15000);
            sendQueue();
        }   

        // Get initial Internet Connection
        $scope.$on('$ionicView.afterEnter', function(){
            document.addEventListener("deviceready", function () {
                if(navigator.connection.type !== Connection.NONE){
                    performOnlineFunction();
                } else {
                    performOfflineFunction();
                }
            });
        });

        $scope.$on('$ionicView.beforeLeave', function(){
            // Stop all possible intervals
            $interval.cancel($scope.intervalQueue);
            $interval.cancel($scope.intervalRefresh);
            $interval.cancel($scope.highlightInterval);
        });

        // Function that needs to be performed with Online connection
        function performOnlineFunction() {
            $scope.connection = 'Online';

            // Get the planning and werkzaamheden/materialen
            refresh();

            // Initial intervals
            refreshAllIntervals();
        }

        // Function that needs to be performed with Offline connection
        function performOfflineFunction() {
            $scope.connection = 'Offline';

            // Stop all possible intervals
            $interval.cancel($scope.intervalQueue);
            $interval.cancel($scope.intervalRefresh);
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
            OrderService.getOrders().then(function (orders) {
                // Fill $scope.orders with the orders from the LocalStorage ('getplanning')
                $scope.orders = orders;
                setupLocalStorage(orders);  

                checkOrderStatus();

                highlightOrder();

                $scope.highlightInterval = $interval(function(){
                    highlightOrder();
                }, 60000);
            });
        }

        // Create some empty keys in localStorage for all the orders
        function setupLocalStorage(orders) {
            for(var i = 0; i < orders.length; i += 1) {
                PlanningService.createEmptyOrder(orders[i]);
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
                        document.getElementById('orderid' + orderId).className = "orderHighlightItem";
                        document.getElementById('orderstatus' + orderId).className = "orderHighlightItem";
                        document.getElementById('orderklantnaam' + orderId).className = "icon ion-person orderHighlightItem";
                        document.getElementById('orderklanttelefoon' + orderId).className = "icon ion-ios-telephone orderHighlightItem";
                        document.getElementById('orderklantemail' + orderId).className = "icon ion-ios-email-outline orderHighlightItem";
                        document.getElementById('orderadres' + orderId).className = "orderHighlightItem";
                    } else {
                        // Reset the className
                        document.getElementById(orderId).className = "card orderWithoutHighlight";
                        document.getElementById('orderid' + orderId).className = "positive";
                        document.getElementById('orderstatus' + orderId).className = "positive";
                        document.getElementById('orderklantnaam' + orderId).className = "icon ion-person positive";
                        document.getElementById('orderklanttelefoon' + orderId).className = "icon ion-ios-telephone positive";
                        document.getElementById('orderklantemail' + orderId).className = "icon ion-ios-email-outline positive";
                        document.getElementById('orderadres' + orderId).className = "positive";
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

            // Get the 'werkzaamheden' and the 'materialen' 
            PlanningService.setActivities();

            // Update time
            var date = new Date();
            $scope.updateTime = convertTime(date);
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

        function getAlertTime(date, minutes) {
            return new Date(date.getTime() - minutes*60000);
        }

    });