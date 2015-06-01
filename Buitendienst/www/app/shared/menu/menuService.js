angular.module('directory.menuService', [])

    .factory('MenuService', function ($window, $http, $q) {

        return {
            checkIfLoggedIn: function() {
                var loggedIn = false;
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                if(parsedItem !== null) {
                    if(parsedItem.naam !== '') {
                        loggedIn = true;
                    }
                }
                var deferred = $q.defer();
                deferred.resolve(loggedIn);
                return deferred.promise;
            },

            resetAccountDetails: function() {
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                parsedItem.naam = '';
                parsedItem.pincode = '1234';
                $window.localStorage.setItem('account', JSON.stringify(parsedItem));
            },

            getUser: function () {
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.naam);
                return deferred.promise;
            },
        }
    });