angular.module('directory.planningController', [])

    .controller('PlanningCtrl', function ($scope, $rootScope, $window, $cordovaNetwork, $ionicLoading, PlanningService, OrderService, $state) {
        // Some initial variables
        $scope.orders = [];
        $scope.orderstatus = 'In behandeling';

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        refresh();
        $scope.connection = 'Online';

        // Watch if the Internet Connection changes 
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $scope.connection = 'Online';

            // Get the planning and werkzaamheden/materialen
            refresh();
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $scope.connection = 'Offline';
        });

        // Fill $scope.orders with the orders from the LocalStorage 
        function getAll() {
            OrderService.getOrders().then(function (orders) {
                $scope.orders = orders;

                for(var index = 0; index < $scope.orders.length; index += 1) {
                    OrderService.checkOrderStatus($scope.orders[index].orderid);
                    $scope.orders[index].orderstatus;
                }

                setupLocalStorage(orders);
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

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }
    });