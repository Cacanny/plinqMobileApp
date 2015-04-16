angular.module('directory.controllers', [])

    .config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

    .controller('PlanningIndexCtrl', function ($scope, PlanningService, Camera) {
        $scope.orders = [];

        $scope.refresh = function() {
            $scope.orders = PlanningService.getOrder($scope);
        };

        $scope.orders = PlanningService.getOrders($scope);

        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
            }, function(err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };

    })

    .controller('OrderDetailCtrl', function ($scope, PlanningService) {

    });