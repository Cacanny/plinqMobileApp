angular.module('directory.activitiesService', [])

    .factory('ActivitiesService', function (PlanningService, $q, $window) {

        var activities;

        return {
            getActivities: function () {
                activities = PlanningService.getActivities();
                var deferred = $q.defer();
                deferred.resolve(activities);
                return deferred.promise;
            },

            setMaterialen: function (orderid, materialen) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.materialen = materialen;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getMaterialen: function (orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.materialen);
                return deferred.promise;
            },

            checkForCustomMateriaal: function(materiaal) {
                var bools = [];
                var bool = true;
                var parsedItem = JSON.parse($window.localStorage.getItem('activities'));
                for(var index = 0; index < parsedItem.materialen.length; index += 1) {
                    if(materiaal !== parsedItem.materialen[index]) {
                        bools.push(true);
                    } else {
                        bools.push(false);
                    }
                }
                // If ALL bools are true, then it is a custom Materiaal else not!
                for(var index = 0; index < bools.length; index += 1) {
                    if(!bools[index]) {
                        // If there is 1 false, then it's not a custom Materiaal
                        bool = false;
                        break;
                    }
                }
                var deferred = $q.defer();
                deferred.resolve(bool);
                return deferred.promise;
            },

            deleteMateriaal: function(orderid, materialen) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.materialen = materialen;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            setWerkzaamheden: function(orderid, werkzaamheden) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.werkzaamheden = werkzaamheden;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
            },

            getWerkzaamheden: function (orderid) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.werkzaamheden);
                return deferred.promise;
            },

            checkForCustomWerkzaamheid: function(werkzaamheid) {
                var bools = [];
                var bool = true;
                var parsedItem = JSON.parse($window.localStorage.getItem('activities'));
                for(var index = 0; index < parsedItem.werkzaamheden.length; index += 1) {
                    if(werkzaamheid !== parsedItem.werkzaamheden[index]) {
                        bools.push(true);
                    } else {
                        bools.push(false);
                    }
                }
                // If ALL bools are true, then it is a custom Materiaal else not!
                for(var index = 0; index < bools.length; index += 1) {
                    if(!bools[index]) {
                        // If there is 1 false, then it's not a custom Materiaal
                        bool = false;
                        break;
                    }
                }
                var deferred = $q.defer();
                deferred.resolve(bool);
                return deferred.promise;
            },

            deleteWerkzaamheid: function(orderid, werkzaamheden) {
                var parsedItem = JSON.parse($window.localStorage.getItem('order' + orderid));
                parsedItem.werkzaamheden = werkzaamheden;
                $window.localStorage.setItem('order' + orderid, JSON.stringify(parsedItem));
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