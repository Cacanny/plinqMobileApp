
angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService, OrderService, $cordovaCamera, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate) {

        // Function to get the images from the LocalStorage and story an array with these images
        PhotoService.getPhotoImage($scope.order.orderid).then(function (photos) {
            $scope.allPhotos = photos;
        });


        // If the photo tab needs to be opened
        $scope.showPhotoBool = false;
        $scope.showPhotos = function () {
            checkIfOrderFinished();

            $scope.showPhotoBool = !$scope.showPhotoBool;
        }

        function checkIfOrderFinished() {
            // $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);

            // Check if the order has been sent with the 'Afgerond' status, if so, disable the add button
            OrderService.inQueueBool($scope.order.orderid).then(function (bool) {
                if ($scope.orderFinished || !$scope.orderIsStarted && !bool) {
                    angular.element(document).ready(function () {
                        var elements = document.getElementsByClassName('removeAfterFinish');
                        for (var index = 0; index < elements.length; index += 1) {
                            elements[index].style.display = 'none';
                        }
                    });
                }
            });
        }

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
                checkIfOrderFinished();
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
            if ($scope.photoModal) {
                $scope.photoModal.remove();
            }
        });


        // Camera function 
        $scope.takePicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            }

            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.allPhotos.push(imageData);

                    //uploadPicture(imageData);
                    PhotoService.setPhotoImage($scope.order.orderid, $scope.allPhotos);
                },
                function(err){
                    alert('Error: Foto kon niet worden gemaakt.');
                })
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

                    if ($scope.allPhotos.length !== 0) {
                        $scope.showPhoto('app/components/order/photo/photoPopoverView/photoPopoverView.html');
                    }
                }
            });
        }

        $scope.slideChanged = function (index) {
            $ionicSlideBoxDelegate.update();
        }

    });
