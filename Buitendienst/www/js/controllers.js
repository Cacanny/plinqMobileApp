angular.module('directory.controllers', [])
    .config(function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .controller('PlanningIndexCtrl', function ($scope, $rootScope, $window, $cordovaNetwork, $ionicLoading, $localstorage, PlanningService, $state) {
        $scope.orders = [];

        /* !!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! */
        /* setObject will call the JSON file, if it takes some time, then a loading screen will appear */
        $ionicLoading.show({
            template: "<ion-spinner icon='android'></ion-spinner><br/> Planning wordt geupdated..."
        });
        $localstorage.setObject().then(function(){
            $ionicLoading.hide();
            getAll();
            $scope.connection = 'Online';
        });

        /* Watch if the Internet Connection changes */
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $scope.connection = 'Online';

            /* setObject will call the JSON file, if it takes some time, then a loading screen will appear */
            $ionicLoading.show({
                template: "<ion-spinner icon='android'></ion-spinner> Actuele planning wordt opgehaald..."
            });
            $localstorage.setObject().then(function(){
                $ionicLoading.hide();
                getAll();
            });
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            $scope.connection = 'Offline';

            $window.localStorage.clear();
            getAll();
        });

        /* Fill orders with the planning */
        function getAll() {
            PlanningService.getPlanning().then(function (planning) {
                $scope.orders = planning;
            });
        }

        /* Manual refresh to get the new JSON */
        $scope.refresh = function() {
            $localstorage.setObject().then(function () {
                getAll();
            });
        }

        /* Navigate to other state using ng-click */
        $scope.details = function (id) {
            $state.go('app.order', { orderId: id });
        };

        /* Get the current date and convert it to dd-mm-yyyy format*/
        var date = new Date();
        $scope.date = "18-04-2015";
        //$scope.date = convertDate(date);

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
        }
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, Camera, PlanningService) {
        PlanningService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
        });

        $scope.date = new Date();

        $scope.getPhoto = function () {
            Camera.getPicture().then(function (imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
            }, function (err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };
    })

    .controller('ContentController', function ($scope, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

    })

    .controller('AppCtrl', function ($scope) {
        $scope.settings = {
            friendsEnabled: true
        }
    });
