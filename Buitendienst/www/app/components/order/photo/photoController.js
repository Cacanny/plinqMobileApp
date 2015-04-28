angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService) {
        // Array to save the photo's 
        $scope.photoArr = [];

        // Camera function 
        $scope.getPhoto = function ($event) {
            $event.stopPropagation();
            PhotoService.getPicture().then(function (imageURI) {
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
        }
    });
