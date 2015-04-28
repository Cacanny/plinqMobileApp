angular.module('directory.activitiesService', [])

    .factory('ActivitiesService', function (PlanningService, $q) {

        var activities;

        return {
            getActivities: function () {
                activities = PlanningService.getActivities();
                var deferred = $q.defer();
                deferred.resolve(activities);
                return deferred.promise;
            },

            splitArray: function (array, columns) {
                if (array.length <= columns) {
                    return [array];
                };

                var rowsNum = Math.ceil(array.length / columns); //4

                var rowsArray = new Array(columns);

                for (var i = 0; i < columns; i++) {
                    var columnsArray = new Array(rowsNum);
                    for (j = 0; j < rowsNum; j++) {
                        var index = i * rowsNum + j;

                        if (index < array.length) {
                            columnsArray[j] = array[index];
                        } else {
                            columnsArray.splice(j, 1);
                            break;
                        }
                    }
                    rowsArray[i] = columnsArray;
                }
                return rowsArray;
            }
        }
    });