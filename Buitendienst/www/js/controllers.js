angular.module('directory.controllers', [])
    //.config(function ($compileProvider) {
    //    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    //})
    .controller('PlanningIndexCtrl', function ($scope, $rootScope, $window, $cordovaNetwork, $ionicLoading, $localstorage, OrderService, $state) {
        //Get the 'werkzaamheden' and the 'materialen' 
        $scope.activities = '';
        $localstorage.setActivities().then(function () {
            $scope.activities = $localstorage.getActivities();
        });

        //Some variables 
        $scope.orders = [];
        $scope.orderstatus = 'In behandeling';

        //!!!!!!!!! Only for testing in browser, otherwise remove it !!!!!!!!! 
        //setObject will call the JSON file, if it takes some time, then a loading screen will appear 
        $ionicLoading.show({
            template: "<ion-spinner icon='android'></ion-spinner><br/> Actuele planning wordt opgehaald..."
        });
        $localstorage.setPlanning().then(function () {
            $ionicLoading.hide();
            getAll();
            $scope.connection = 'Online';
        });

        //Watch if the Internet Connection changes 
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $scope.connection = 'Online';

            // setObject will call the JSON file, if it takes some time, then a loading screen will appear 
            $ionicLoading.show({
                template: "<ion-spinner icon='android'></ion-spinner><br/> Actuele planning wordt opgehaald..."
            });
            $localstorage.setPlanning().then(function () {
                $ionicLoading.hide();
                getAll();
            });
            $localstorage.setActivities();
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $scope.connection = 'Offline';

            $window.localStorage.clear();
            getAll();
        });

        // Fill $scope.orders with the orders from the LocalStorage 
        function getAll() {
            OrderService.getOrders().then(function (orders) {
                $scope.orders = orders;
            });
        }

        // Manual refresh to get the new JSON files
        $scope.refresh = function () {
            $localstorage.setPlanning().then(function () {
                getAll();
            });
            $localstorage.setActivities();
        };

        // Navigate to other state using ng-click
        $scope.details = function (id) {
            $state.go('app.order', { orderId: id });
        };

        // Get the current date and convert it to dd-mm-yyyy format
        var date = new Date();
        $scope.date = "18-04-2015";
        //$scope.date = convertDate(date);

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, Camera, OrderService, $ionicModal, $localstorage) {
        OrderService.findByOrderId($stateParams.orderId).then(function (order) {
            $scope.order = order;
            $scope.showTickets = true;
            if (JSON.stringify($scope.order.ticket) === '{}') {
                $scope.showTickets = false;
            }
        });

        // Initial state of ng-show for the Ticketnotities
        $scope.showme = true;

        // Get the date of today, used at 'Afronding'
        $scope.date = new Date();

        // Count the total 'Aantal' at Materialen input
        $scope.total = 1;
        $scope.count = function(minplus) {
            $scope.total += minplus;
            if($scope.total < 1) {
                $scope.total = 1;
            }
        }

        // Get the activities stored in localStorage
        $scope.activities = $localstorage.getActivities();

        // Push an extra option for the dropdown list
        $scope.activities.materialen.push('Anders, namelijk:');
        $scope.activities.werkzaamheden.push('Anders, namelijk:');

        // This was needed to get value of the selected radio button
        $scope.materiaal = {naam: ''};

        // To save all the materialen in
        $scope.materialen = {materialen: []};

        $scope.savemateriaal = function() {
            var savesucces = false;
            
            // Get specificatie
            var specificatie = document.getElementById('specificatie_materiaal').value;

            if($scope.materiaal.naam !== '') {

                if($scope.materiaal.naam == 'Anders, namelijk:') {
                    var naam = document.getElementById('naam').value;
                    if(naam) {
                        // Add to the materialen array
                        $scope.materialen.materialen.push({
                            aantal: $scope.total, naam: naam, specificatie: specificatie
                        });

                        savesucces = true;
                    }
                } else {
                    // Add to the materialen array
                    $scope.materialen.materialen.push({
                        aantal: $scope.total, naam: $scope.materiaal.naam, specificatie: specificatie
                    });
                    
                    savesucces = true;
                }

                if(savesucces) {
                    // And show the header
                    $scope.toShowArr[4] = true;

                    // Reset all values
                    $scope.total = 1;
                    $scope.materiaal.naam = '';
                    document.getElementById('specificatie_materiaal').value = '';
                    var selection = document.getElementsByName("materialen");
                        for(var i=0;i<selection.length;i++) {
                            selection[i].checked = false;
                        }
                }
            }
        }

        $scope.resetmateriaal = function() {
            // Reset all values
            $scope.total = 1;
            $scope.materiaal.naam = '';
            document.getElementById('specificatie_materiaal').value = '';
            var selection = document.getElementsByName("materialen");
                for(var i=0;i<selection.length;i++) {
                    selection[i].checked = false;
                }
        }

        // This was needed to get value of the selected radio button
        $scope.werkzaamheid = {beschrijving: ''};

        // To save all the materialen in
        $scope.werkzaamheden = {werkzaamheden: []};

        $scope.savewerkzaamheid = function() {
            var savesucces = false;

            // Get specificatie
            var specificatie = document.getElementById('specificatie_werkzaamheid').value;

            if($scope.werkzaamheid.beschrijving !== '') {

                if($scope.werkzaamheid.beschrijving == 'Anders, namelijk:') {
                    var beschrijving = document.getElementById('beschrijving').value;

                    if(beschrijving) {
                        // Add to the werkzaamheden array
                        $scope.werkzaamheden.werkzaamheden.push({
                            beschrijving: beschrijving, specificatie: specificatie
                        });

                        savesucces = true;
                    }
                } else {
                    // Add to the werkzaamheden array
                    $scope.werkzaamheden.werkzaamheden.push({
                        beschrijving: $scope.werkzaamheid.beschrijving, specificatie: specificatie
                    });

                    savesucces = true;
                }

                if(savesucces) {
                    // And show the header
                    $scope.toShowArr[7] = true;

                    // Reset all values
                    $scope.werkzaamheid.beschrijving = '';
                    document.getElementById('specificatie_werkzaamheid').value = '';
                    var selection = document.getElementsByName("werkzaamheden");
                        for(var i=0;i<selection.length;i++) {
                            selection[i].checked = false;
                        }
                }
            }
        }

        $scope.resetwerkzaamheid = function() {
            // Reset all values
            $scope.werkzaamheid.beschrijving = '';
            document.getElementById('specificatie_werkzaamheid').value = '';
            var selection = document.getElementsByName("werkzaamheden");
                for(var i=0;i<selection.length;i++) {
                    selection[i].checked = false;
                }
        }

        // Array to save the photo's 
        $scope.photoArr = [];

        // Camera function 
        $scope.getPhoto = function($event) {
            $event.stopPropagation();
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

        // Ionic Modal
        $ionicModal.fromTemplateUrl('modal', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function (include, $event) {
            $event.stopPropagation();
            $scope.include = include;
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope._signatureImage = OrderService.getSignatureImage();            
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Keep track of all the elements that are collapsed or not
        // True = expanded, False = collapsed
        // The names are just for clarification

        $scope.toShowArr = [
            true, true, true, false, false, false, false, false, false
        ];

        // Toggles the state of a window to true or false
        $scope.toggle = function (index) {
            $scope.toShowArr[index] = !$scope.toShowArr[index];
        };
    })

    .controller('SignatureCtrl', function ($scope, OrderService) {
        var canvas = document.getElementById('signatureCanvas');
        resizeCanvas();
        var signaturePad = new SignaturePad(canvas);

        signaturePad.minWidth = 2.5;
        signaturePad.maxWidth = 3.5;

        $scope.clearCanvas = function () {
            signaturePad.clear();
        }

        $scope.saveCanvas = function () {
            var sigImg = signaturePad.toDataURL();
            $scope.signature = sigImg;
            OrderService.setSignatureImage(sigImg);
        }

        function resizeCanvas() {
            var ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth; //document.width is obsolete
            canvas.height = window.innerHeight - 100; //document.height is obsolete
        };
    })

    .controller('AppCtrl', function ($scope) {
        $scope.settings = {
            friendsEnabled: true
        }
    });
