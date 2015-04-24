angular.module('planningController', [])

    .controller('PlanningIndexCtrl', function ($scope, $rootScope, $window, $cordovaNetwork, $ionicLoading, PlanningService, OrderService, $state) {
        //Get the 'werkzaamheden' and the 'materialen' 
        $scope.activities = '';
        PlanningService.setActivities().then(function () {
            $scope.activities = PlanningService.getActivities();
        });

        //Some variables 
        $scope.orders = [];
        $scope.orderstatus = 'In behandeling';

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        //setObject will call the JSON file, if it takes some time, then a loading screen will appear 
        $ionicLoading.show({
            template: "<ion-spinner icon='android'></ion-spinner><br/> Actuele planning wordt opgehaald..."
        });
        PlanningService.setPlanning().then(function () {
            $ionicLoading.hide();
            getAll();
            $scope.connection = 'Online';
        });

        //Watch if the Internet Connection changes 
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $scope.connection = 'Online';

            // setObject will call the JSON file, if it takes some time, then a loading screen will appear 
            $ionicLoading.show({
                template: "<ion-spinner icon='android'></ion-spinner><br/> Actuele planning wordt opgehaald..."
            });
            PlanningService.setPlanning().then(function () {
                $ionicLoading.hide();
                getAll();
            });
            PlanningService.setActivities();
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $scope.connection = 'Offline';

            $window.localStorage.clear();
            getAll();
        });

        // Fill $scope.orders with the orders from the LocalStorage 
        function getAll() {
            OrderService.getOrders().then(function (orders) {
                $scope.orders = orders;
            });
        }

        // Manual refresh to get the new JSON files
        $scope.refresh = function () {
            PlanningService.setPlanning().then(function () {
                getAll();
            });
            PlanningService.setActivities();
        };

        // Navigate to other state using ng-click
        $scope.details = function (id) {
            $state.go('app.order', { orderId: id });
        };

        // Get the current date and convert it to dd-mm-yyyy format
        var date = new Date();
        $scope.date = "18-04-2015";
        //$scope.date = convertDate(date);

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }
    })