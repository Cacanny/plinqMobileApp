angular.module('directory.activitiesController', [])

    .controller('ActivitiesCtrl', function ($scope, ActivitiesService, $ionicPopup) {

        // Count the total 'Aantal' at Materialen input
        $scope.total = 1;
        $scope.count = function (minplus) {
            $scope.total += minplus;
            if ($scope.total < 1) {
                $scope.total = 1;
            }
        }

        // Get the activities stored in localStorage
        ActivitiesService.getActivities().then(function (activities) {
            $scope.activities = activities;

            // Push an extra option for the dropdown list
            $scope.activities.materialen.push('Anders, namelijk:');
            $scope.activities.werkzaamheden.push('Anders, namelijk:');

            // Split the arrays into X amount of rows for displaying
            $scope.activities.materialen = ActivitiesService.splitArray($scope.activities.materialen, 2);
            $scope.activities.werkzaamheden = ActivitiesService.splitArray($scope.activities.werkzaamheden, 2);

        });

        // This was needed to get value of the selected radio button
        $scope.materiaal = { naam: '' };

        // Create an array of materialen and fill it with the values of LocalStorage
        function checkForMaterialen() {
            ActivitiesService.getMaterialen($scope.order.orderid).then(function (materialenList) {
                if (JSON.stringify(materialenList) !== '[]') {
                    // Show header of materialen
                    $scope.showMateriaalHeader = true;
                } else {
                    $scope.showMateriaalHeader = false;
                }
                $scope.materialen = { materialen: materialenList };
            });
        }
        checkForMaterialen();

        $scope.materiaalEdited = false;
        var materiaalIndex;

        $scope.savemateriaal = function () {
            var savesucces = false;

            // Get specificatie
            var specificatie = document.getElementById('specificatie_materiaal').value;

            if ($scope.materiaal.naam !== '') {

                if ($scope.materiaal.naam === 'Anders, namelijk:') {
                    var naam = document.getElementById('naam').value;
                    if (naam) {
                        if($scope.materiaalEdited) {
                            // Override the materiaal in the array
                            $scope.materialen.materialen[materiaalIndex] = {
                                aantal: $scope.total, naam: naam, specificatie: specificatie
                            }
                        } else {
                            // Add to the materialen array
                            $scope.materialen.materialen.push({
                                aantal: $scope.total, naam: naam, specificatie: specificatie
                            });
                        }

                        savesucces = true;
                    }
                } else {
                    if($scope.materiaalEdited) {
                        // Override the materiaal in the array
                        $scope.materialen.materialen[materiaalIndex] = {
                            aantal: $scope.total, naam: $scope.materiaal.naam, specificatie: specificatie
                        }
                    } else {
                        // Add to the materialen array
                        $scope.materialen.materialen.push({
                            aantal: $scope.total, naam: $scope.materiaal.naam, specificatie: specificatie
                        });
                    }

                    savesucces = true;
                }

                if (savesucces) {
                    // And show the header
                    $scope.showMateriaalHeader = true;

                    // Save directly into localStorage at the correct order
                    ActivitiesService.setMaterialen($scope.order.orderid, $scope.materialen.materialen);

                    // Reset all values
                    $scope.resetmateriaal();

                    // Reset the highlight if you edited a materiaal
                    if($scope.materiaalEdited) {
                        document.getElementById('materiaal' + materiaalIndex).className = document.getElementById('materiaal' + materiaalIndex).className.replace(/\bhighlight\b/,'');
                    }

                    $scope.materiaalEdited = false;
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

        var lastMateriaalIndex = 0;
        $scope.editMateriaal = function(index) {
            // Remove the highlight from the index selected before
            document.getElementById('materiaal' + lastMateriaalIndex).className = document.getElementById('materiaal' + lastMateriaalIndex).className.replace(/\bhighlight\b/,'');
            lastMateriaalIndex = index;
            // Add the highlight to the new selected index
            document.getElementById('materiaal' + index).className += " highlight";
            
            // Set all the stored values back to the input fields
            $scope.toShowArr[3] = true;
            $scope.total = $scope.materialen.materialen[index].aantal;
            $scope.specificatie_materiaal = $scope.materialen.materialen[index].specificatie;
            document.getElementById('specificatie_materiaal').value = $scope.specificatie_materiaal; 

            // Check if there had been put a 'custom' materiaalNaam 
            var naam = $scope.materialen.materialen[index].naam;
            ActivitiesService.checkForCustomMateriaal(naam).then(function(bool) {
                if(bool){
                    $scope.materiaal.naam = 'Anders, namelijk:';
                    $scope.customMateriaalNaam = naam;
                } else {
                    $scope.materiaal.naam = naam;
                    $scope.customMateriaalNaam = '';
                }
            });

            $scope.materiaalEdited = true;
            materiaalIndex = index;
        }

        $scope.deleteMateriaal = function(index) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Verwijder Materiaal</b>',
                template: 'Wilt u dit materiaal verwijderen?<br/>' + 
                            '<br/>Aantal: <b>' + $scope.materialen.materialen[index].aantal + 
                            '</b><br/>Naam: <b>' + $scope.materialen.materialen[index].naam +
                            '</b><br/>Specificatie: <b>' + $scope.materialen.materialen[index].specificatie + '</b>'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    // Delete materiaal from the array and give that array to the service to delete from LocalStorage
                    $scope.materialen.materialen.splice(index, 1);
                    ActivitiesService.deleteMateriaal($scope.order.orderid, $scope.materialen.materialen);
                    if($scope.materialen.materialen.length < 1) {
                        $scope.showMateriaalHeader = false;
                    }

                    // Reset materiaalEdited and reset values if you try to delete a Materiaal you wanted to edit
                    $scope.materiaalEdited = false;
                    $scope.resetmateriaal();
                }
            });
        }

        // This was needed to get value of the selected radio button
        $scope.werkzaamheid = { beschrijving: '' };

        // Create an array of werkzaamheden and fill it with the values of LocalStorage
        function checkForWerkzaamheden() {
            ActivitiesService.getWerkzaamheden($scope.order.orderid).then(function (werkzaamhedenList) {
                if (JSON.stringify(werkzaamhedenList) !== '[]') {
                    // Show header of werkzaamheden
                    $scope.showWerkzaamheidHeader = true;
                } else {
                    $scope.showWerkzaamheidHeader = false;
                }
                $scope.werkzaamheden = { werkzaamheden: werkzaamhedenList };
            });
        }
        checkForWerkzaamheden();

        $scope.werkzaamheidEdited = false;
        var werkzaamheidIndex;

        $scope.savewerkzaamheid = function () {
            var savesucces = false;

            // Get specificatie
            var specificatie = document.getElementById('specificatie_werkzaamheid').value;

            if ($scope.werkzaamheid.beschrijving !== '') {

                if ($scope.werkzaamheid.beschrijving == 'Anders, namelijk:') {
                    var beschrijving = document.getElementById('beschrijving').value;

                    if (beschrijving) {
                        if($scope.werkzaamheidEdited) {
                            // Override the werkzaamheid in the array
                            $scope.werkzaamheden.werkzaamheden[werkzaamheidIndex] = {
                                beschrijving: beschrijving, specificatie: specificatie
                            }
                        } else {
                            // Add to the werkzaamheden array
                            $scope.werkzaamheden.werkzaamheden.push({
                                beschrijving: beschrijving, specificatie: specificatie
                            });
                        }

                        savesucces = true;
                    }
                } else {
                    if($scope.werkzaamheidEdited) {
                        // Override the werkzaamheid in the array
                        $scope.werkzaamheden.werkzaamheden[werkzaamheidIndex] = {
                            beschrijving: $scope.werkzaamheid.beschrijving, specificatie: specificatie
                        }
                    } else {
                        // Add to the werkzaamheden array
                        $scope.werkzaamheden.werkzaamheden.push({
                            beschrijving: $scope.werkzaamheid.beschrijving, specificatie: specificatie
                        });
                    }

                    savesucces = true;
                }

                if (savesucces) {
                    // And show the header
                    $scope.showWerkzaamheidHeader = true;

                    // Save directly into localStorage at the correct order
                    ActivitiesService.setWerkzaamheden($scope.order.orderid, $scope.werkzaamheden.werkzaamheden);

                    // Reset all values
                    $scope.resetwerkzaamheid();

                    // Reset the highlight if you edited a werkzaamheid
                    if($scope.werkzaamheidEdited) {
                        document.getElementById('werkzaamheid' + werkzaamheidIndex).className = document.getElementById('werkzaamheid' + werkzaamheidIndex).className.replace(/\bhighlight\b/,'');
                    }

                    $scope.werkzaamheidEdited = false;
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

        var lastWerkzaamheidIndex = 0;
        $scope.editWerkzaamheid = function(index) {
            // Remove the highlight from the index selected before
            document.getElementById('werkzaamheid' + lastWerkzaamheidIndex).className = document.getElementById('werkzaamheid' + lastWerkzaamheidIndex).className.replace(/\bhighlight\b/,'');
            lastWerkzaamheidIndex = index;
            // Add the highlight to the new selected index
            document.getElementById('werkzaamheid' + index).className += " highlight";
            
            // Set all the stored values back to the input fields
            $scope.toShowArr[5] = true;
            $scope.specificatie_werkzaamheid = $scope.werkzaamheden.werkzaamheden[index].specificatie;
            document.getElementById('specificatie_werkzaamheid').value = $scope.specificatie_werkzaamheid; 

            // Check if there had been put a 'custom' werkzaamheidBeschrijving 
            var beschrijving = $scope.werkzaamheden.werkzaamheden[index].beschrijving;
            ActivitiesService.checkForCustomWerkzaamheid(beschrijving).then(function(bool) {
                if(bool){
                    $scope.werkzaamheid.beschrijving = 'Anders, namelijk:';
                    $scope.customWerkzaamheidBeschrijving = beschrijving;
                } else {
                    $scope.werkzaamheid.beschrijving = beschrijving;
                    $scope.customWerkzaamheidBeschrijving = '';
                }
            });

            $scope.werkzaamheidEdited = true;
            werkzaamheidIndex = index;
        }

        $scope.deleteWerkzaamheid = function(index) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Verwijder Werkzaamheid</b>',
                template: 'Wilt u deze werkzaamheid verwijderen?<br/>' + 
                            '<br/>Beschrijving: <b>' + $scope.werkzaamheden.werkzaamheden[index].beschrijving + 
                            '</b><br/>Specificatie: <b>' + $scope.werkzaamheden.werkzaamheden[index].specificatie + '</b>'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    // Delete werkzaamheid from the array and give that array to the service to delete from LocalStorage
                    $scope.werkzaamheden.werkzaamheden.splice(index, 1);
                    ActivitiesService.deleteWerkzaamheid($scope.order.orderid, $scope.werkzaamheden.werkzaamheden);

                    if($scope.werkzaamheden.werkzaamheden.length < 1) {
                        $scope.showWerkzaamheidHeader = false;
                    }

                    // Reset werkzaamheidEdited and reset values if you try to delete a Werkzaamheid you wanted to edit
                    $scope.werkzaamheidEdited = false;
                    $scope.resetwerkzaamheid();
                }
            });
        }
    });
