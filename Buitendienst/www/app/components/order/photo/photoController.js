
angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService, $ionicModal, $ionicPopup) {
      
        // Function to get the images from the LocalStorage and story an array with these images
        PhotoService.getPhotoImage($scope.order.orderid).then(function (photos) {
            $scope.allPhotos = photos;
        });

        // Opens a modal screen that shows the image fullscreen
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            console.log("ActiveSlide has a number of " + $scope.activeSlide);
            $scope.showModal('app/components/order/photo/photoPopoverView/photoPopoverView.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
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
        // End of Modal 

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
        $scope.deletePicture = function (index) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Verwijder Foto',
                template: 'Wilt u deze foto verwijderen?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // Delete image from the array and give that array to the service to delete from LocalStorage
                    $scope.allPhotos.splice(index, 1);
                    $scope.activeSlide -= 1;
                    if ($scope.activeSlide === -1) {
                        $scope.activeSlide = 0;
                    }
                    $scope.closePicture();
                    PhotoService.setPhotoImage($scope.order.orderid, $scope.allPhotos);
                    $scope.showModal('app/components/order/photo/photoPopoverView/photoPopoverView.html');
                }
            });
        }

        // Function tracks the currently selected image, this is needed for deletion.
        $scope.indexChanged = function(index) {
            $scope.activeSlide = index;
        }
    });
