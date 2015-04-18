angular.module('directory.controllers', [])
    .config(function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .controller('PlanningIndexCtrl', function ($scope, PlanningService, $state) {
        $scope.orders = [];
        $scope.orders = PlanningService.getPlanning($scope);
        $scope.refresh = function() {
            $scope.orders = PlanningService.getPlanning($scope);
        };

        $scope.details = function (id) {
            $state.go('app.order', { orderId: id });
        };

        $scope.date = new Date();
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

    .controller('AppCtrl', function ($scope, $stateParams) {
    });
