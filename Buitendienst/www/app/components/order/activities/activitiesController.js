angular.module('directory.activitiesController', [])

    .controller('ActivitiesCtrl', function ($scope, ActivitiesService) {

        // Count the total 'Aantal' at Materialen input
        $scope.total = 1;
        $scope.count = function (minplus) {
            $scope.total += minplus;
            if ($scope.total < 1) {
                $scope.total = 1;
            }
        }

        // Get the activities stored in localStorage
        ActivitiesService.getActivities().then(function(activities){
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
    });
