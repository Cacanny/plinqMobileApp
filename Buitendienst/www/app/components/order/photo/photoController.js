
angular.module('directory.photoController', [])

    .controller('PhotoCtrl', function ($scope, PhotoService, OrderService, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate, $cordovaCamera, $cordovaFile) {

        // Function to get the images from the LocalStorage and story an array with these images
        //PhotoService.getPhotoImage($scope.order.orderid).then(function (photos) {
        //    $scope.allPhotos = photos;
        //});

        $scope.allPhotos = [];

        // If the photo tab needs to be opened
        $scope.showPhotoBool = false;
        $scope.showPhotos = function () {
            checkIfOrderFinished();

            $scope.showPhotoBool = !$scope.showPhotoBool;
        }

        function checkIfOrderFinished(){
            // $scope.orderFinished = OrderService.checkIfFinished($scope.order.orderid);
           
            // Check if the order has been sent with the 'Afgerond' status, if so, disable the add button
            OrderService.inQueueBool($scope.order.orderid).then(function(bool){
                if($scope.orderFinished || !$scope.orderIsStarted && !bool) {
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

        //$scope.takePicture = function () {
        //    alert("Ik ga een foto maken");

        //    // 2
        //    var options = {
        //        destinationType: Camera.DestinationType.FILE_URI,
        //        sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
        //        allowEdit: false,
        //        encodingType: Camera.EncodingType.JPEG,
        //        popoverOptions: CameraPopoverOptions,
        //    };

        //    // 3
        //    navigator.getPicture(options).then(function (imageData) {
        //        alert("Kom ik hier?");

        //        // 4
        //        onImageSuccess(imageData);

        //        function onImageSuccess(fileURI) {
        //            createFileEntry(fileURI);
        //        }

        //        function createFileEntry(fileURI) {
        //            window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        //        }

        //        // 5
        //        function copyFile(fileEntry) {
        //            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        //            var newName = makeid() + name;

        //            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
        //                fileEntry.copyTo(
        //                fileSystem2,
        //                newName,
        //                onCopySuccess,
        //                fail
        //                );
        //            },
        //            fail);
        //        }

        //        // 6
        //        function onCopySuccess(entry) {
        //            $scope.$apply(function () {
        //                $scope.allPhotos.push(entry.nativeURL);
        //                alert("Foto is gemaakt en succesvol opgeslagen");
        //            });
        //        }

        //        function fail(error) {
        //            console.log("fail: " + error.code);
        //            alert(error);
        //        }

        //        function makeid() {
        //            var text = "";
        //            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //            for (var i = 0; i < 5; i++) {
        //                text += possible.charAt(Math.floor(Math.random() * possible.length));
        //            }
        //            return text;
        //        }

        //    }, function (err) {
        //        alert(err);
        //        console.log(err);
        //    });
        //}

        // Camera function 
        $scope.takePicture = function () {
            PhotoService.getPicture()
              .then(function (imageData) {
                  // imageData is your base64-encoded image
                  // update some ng-src directive
                  $scope.allPhotos.push(imageData);
                  //$scope.picSrc = "data:image/jpeg;base64," + imageData;
                  //$scope.allPhotos.push($scope.picSrc);
                  PhotoService.setPhotoImage($scope.order.orderid, $scope.allPhotos);
              })
              .catch(function (err) {
                  console.log(err);
              });
        }

        // Function makes sure the correct image is loaded
        $scope.urlForImage = function (imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
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
