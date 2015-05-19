
angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate) {
      
        // Function to get the images from the LocalStorage and story an array with these images
        PhotoService.getPhotoImage($scope.order.orderid).then(function (photos) {
            $scope.allPhotos = photos;
        });

        // Opens a modal screen that shows the image fullscreen
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showPhoto('app/components/order/photo/photoPopoverView/photoPopoverView.html');
        }

        $scope.showPhoto = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                backdropClickToClose: false,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.photoModal = modal;
                $scope.photoModal.show();
            });
        }

        // Close the modal
        $scope.closePicture = function () {
            $scope.photoModal.remove();
        }
        
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.photoModal.remove();
        });

        // Camera function 
        $scope.takePicture = function () {
            PhotoService.getPicture()
              .then(function (imageData) {
                  // imageData is your base64-encoded image
                  // update some ng-src directive
                  $scope.picSrc = "data:image/jpeg;base64," + imageData;
                  $scope.allPhotos.push($scope.picSrc);
                  PhotoService.setPhotoImage($scope.order.orderid, $scope.allPhotos);
              })
              .catch(function (err) {
                  console.log(err);
              });
        }

        // Deletes the currently selected photo 
        $scope.deletePicture = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Verwijder Foto</b>',
                template: 'Wilt u deze foto verwijderen?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // Delete image from the array and give that array to the service to delete from LocalStorage
                    $scope.allPhotos.splice($ionicSlideBoxDelegate.currentIndex(), 1);

                    $scope.activeSlide -= 1;
                    if ($scope.activeSlide === -1) {
                        $scope.activeSlide = 0;
                    }
                    $scope.closePicture();
                    PhotoService.setPhotoImage($scope.order.orderid, $scope.allPhotos);

                    if($scope.allPhotos.length !== 0) {
                        $scope.showPhoto('app/components/order/photo/photoPopoverView/photoPopoverView.html');
                    }
                }
            });
        }

    });
