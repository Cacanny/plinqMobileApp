angular.module('orderController', [])

    .controller('OrderDetailCtrl', function ($scope, $stateParams, Camera, OrderService, $ionicModal, PlanningService) {

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
        $scope.count = function (minplus) {
            $scope.total += minplus;
            if ($scope.total < 1) {
                $scope.total = 1;
            }
        }

        // Get the activities stored in localStorage
        $scope.activities = PlanningService.getActivities();

        // Push an extra option for the dropdown list
        $scope.activities.materialen.push('Anders, namelijk:');
        $scope.activities.werkzaamheden.push('Anders, namelijk:');

        // This was needed to get value of the selected radio button
        $scope.materiaal = { naam: '' };

        // To save all the materialen in
        $scope.materialen = { materialen: [] };

        $scope.savemateriaal = function () {
            var savesucces = false;

            // Get specificatie
            var specificatie = document.getElementById('specificatie_materiaal').value;

            if ($scope.materiaal.naam !== '') {

                if ($scope.materiaal.naam == 'Anders, namelijk:') {
                    var naam = document.getElementById('naam').value;
                    if (naam) {
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

                if (savesucces) {
                    // And show the header
                    $scope.toShowArr[4] = true;

                    // Reset all values
                    $scope.total = 1;
                    $scope.materiaal.naam = '';
                    document.getElementById('specificatie_materiaal').value = '';
                    var selection = document.getElementsByName("materialen");
                    for (var i = 0; i < selection.length; i++) {
                        selection[i].checked = false;
                    }
                }
            }
        }

        $scope.resetmateriaal = function () {
            // Reset all values
            $scope.total = 1;
            $scope.materiaal.naam = '';
            document.getElementById('specificatie_materiaal').value = '';
            var selection = document.getElementsByName("materialen");
            for (var i = 0; i < selection.length; i++) {
                selection[i].checked = false;
            }
        }

        // This was needed to get value of the selected radio button
        $scope.werkzaamheid = { beschrijving: '' };

        // To save all the materialen in
        $scope.werkzaamheden = { werkzaamheden: [] };

        $scope.savewerkzaamheid = function () {
            var savesucces = false;

            // Get specificatie
            var specificatie = document.getElementById('specificatie_werkzaamheid').value;

            if ($scope.werkzaamheid.beschrijving !== '') {

                if ($scope.werkzaamheid.beschrijving == 'Anders, namelijk:') {
                    var beschrijving = document.getElementById('beschrijving').value;

                    if (beschrijving) {
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

                if (savesucces) {
                    // And show the header
                    $scope.toShowArr[7] = true;

                    // Reset all values
                    $scope.werkzaamheid.beschrijving = '';
                    document.getElementById('specificatie_werkzaamheid').value = '';
                    var selection = document.getElementsByName("werkzaamheden");
                    for (var i = 0; i < selection.length; i++) {
                        selection[i].checked = false;
                    }
                }
            }
        }

        $scope.resetwerkzaamheid = function () {
            // Reset all values
            $scope.werkzaamheid.beschrijving = '';
            document.getElementById('specificatie_werkzaamheid').value = '';
            var selection = document.getElementsByName("werkzaamheden");
            for (var i = 0; i < selection.length; i++) {
                selection[i].checked = false;
            }
        }

        // Array to save the photo's 
        $scope.photoArr = [];

        // Camera function 
        $scope.getPhoto = function ($event) {
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