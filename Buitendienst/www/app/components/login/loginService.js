angular.module('directory.loginService', [])

    .factory('LoginService', function ($window, $http, $q) {

        return {
            checkIfLoggedIn: function() {
                var loggedIn = false;
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                if(parsedItem.naam !== '') {
                    loggedIn = true;
                }
                var deferred = $q.defer();
                deferred.resolve(loggedIn);
                return deferred.promise;
            },

            setInitialAccountDetails: function() {
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                var account = {
                    'naam':'', 'pincode':'1234'
                }
                
                if(parsedItem !== null) {
                    if(parsedItem.naam !== '') {
                        account = {
                            'naam': parsedItem.naam, 'pincode':'1234'
                        } 
                    }
                }

                $window.localStorage.setItem('account', JSON.stringify(account));
            },

            getPassCode: function() {
                var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                var deferred = $q.defer();
                deferred.resolve(parsedItem.pincode);
                return deferred.promise;
            },

            getUser: function(name, pw) {
                return $http.get("user.json")
                    .success(function (response) {
                        var deferred = $q.defer();
                        deferred.resolve(response);
                        return deferred.promise;
                    })
                    .error(function () {
                        alert('ERROR: Er is iets fout gegaan. Controleer uw internetverbinding.');
                    })
            },

            login: function(response) {
                return $q(function(resolve, reject) {
                  if (response.data.success === 'login is successful') {
                    var parsedItem = JSON.parse($window.localStorage.getItem('account'));
                    parsedItem.naam = response.data.name;
                    $window.localStorage.setItem('account', JSON.stringify(parsedItem));
                    
                    resolve('Login success.');
                  } else {
                    reject('Login failed.');
                  }
                });
            }
        }
    });