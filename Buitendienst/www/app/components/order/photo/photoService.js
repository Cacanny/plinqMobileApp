angular.module('directory.photoService', [])
.factory('PhotoService', function ($rootScope, $q, $cordovaCamera, $ionicLoading, $window, $cordovaFile, $cordovaFileTransfer) {

    var images;
    var IMAGE_STORAGE_KEY = 'images';

    return {

        // Function
        getPicture: function (options) {

            // init $q
            var deferred = $q.defer();

            window.mobileCheck = function () {
                var check = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            };

            // init check and mobile/browser check
            var check = window.mobileCheck();

            if (check === false) {

                // create file input without appending to DOM
                var fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');

                fileInput.onchange = function () {
                    var file = fileInput.files[0];
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                        $rootScope.$apply(function () {
                            // strip beginning from string
                            var encodedData = reader.result.replace(/data:image\/jpeg;base64,/, '');
                            deferred.resolve(encodedData);
                        });
                    };
                };

                fileInput.click();

            } else {

                // function clearCache() {
                //     navigator.camera.cleanup();
                // }

                // set some default options
                var defaultOptions = {
                    quality: 75,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    targetWidth: 1024,
                    targetHeight: 768,
                    // saveToPhotoAlbum: true
                };

                // allow overriding the default options
                options = angular.extend(defaultOptions, options);

                // success callback
                var success = function (imageData) {
                    $rootScope.$apply(function () {
                        deferred.resolve(imageData);
                    });
                };

                // fail callback
                var fail = function (message) {
                    $rootScope.$apply(function () {
                        deferred.reject(message);
                    });
                };

                // open camera via cordova
                // navigator.camera.getPicture(success, fail, options);

                $cordovaCamera.getPicture(options).then(
                    function(imageData) {
                        alert('gelukt');
                        $rootScope.$apply(function () {
                            deferred.resolve(imageData);
                        });
                        // $ionicLoading.show({template: 'Succes! Foto is gemaakt.', duration:500});
                    },
                    function(err){
                         alert('gefaald');
                        $rootScope.$apply(function () {
                            deferred.reject(err);
                        });
                        // $ionicLoading.show({template: 'Error: Camera kon niet geopend worden.', duration:500});
                    });

            }

            //return a promise
            return deferred.promise;
        },

        uploadImage: function(fileURI) {
            // var win = function (r) {
            //     // clearCache();
            //     // retries = 0;
            //     alert('Done! ' + r);
            // }
         
            // var fail = function (error) {
            //     // if (retries == 0) {
            //     //     retries++;
            //     //     setTimeout(function() {
            //     //         onCapturePhoto(fileURI)
            //     //     }, 1000);
            //     // } else {
            //     //     retries = 0;
            //     //     // clearCache();
            //     //     alert('Whoops. Something wrong happens!');
            //     // }

            //     alert('Whoops. Something wrong happens!');
            // }
         
            // var options = new FileUploadOptions();
            // options.fileKey = "file";
            // options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            // options.mimeType = "image/jpeg";
            // options.chunkedMode = true;
            // options.headers = {Connection: "close"};
            // options.params = {}; // if we need to send parameters to the server request
            // var ft = new FileTransfer();
            // ft.upload(fileURI, encodeURI("http://isp-admin-dev.plinq.nl/upload/"), win, fail, options);
        
            var options = {
                fileKey: "photo",
                fileName: fileURI.substr(fileURI.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpeg"
            };

            $cordovaFileTransfer.upload("http://isp-admin-dev.plinq.nl/upload", fileURI, options).then(function(result) {
                alert("SUCCESS: " + JSON.stringify(result));
            }, function(err) {
                alert("ERROR: " + JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
        },

        //Converts data uri to Blob. Necessary for uploading images.
        //@see
        // http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
        //@param  {String} dataURI
        //@return {Blob}
        dataURItoBlob: function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: mimeString });
        },

        setPhotoImage: function (orderid, images) {
            var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
            parsedItem.fotos = images;
            $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
        },

        getPhotoImage: function (orderid) {
            var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
            var deferred = $q.defer();
            deferred.resolve(parsedItem.fotos);
            return deferred.promise;
        },

        deletePhotoImage: function (orderid, images) {
            var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
            parsedItem.fotos = images;
            $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
        }

    };

});