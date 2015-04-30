
angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService) {
        // Array to save the photo's 
        $scope.allPhotos = [];

        // Opens a modal screen that shows the image fullscreen
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('photoPopoverView/photoPopoverView.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
        }

        // Camera function 
        $scope.takePicture = function () {
            alert("Taking a picture now with the takePicture() function");
            PhotoService.getPicture()
              .then(function (imageData) {
                  // imageData is your base64-encoded image
                  // update some ng-src directive
                  $scope.picSrc = "data:image/jpeg;base64," + imageData;
                  $scope.allPhotos.push($scope.picSrc);
              })
              .catch(function (err) {
                  console.log(err);
              });
        }
    });
