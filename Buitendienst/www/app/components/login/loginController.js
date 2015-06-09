angular.module('directory.loginController', [])

    .controller('LoginCtrl', function ($scope, $window, LoginService, $ionicPopup, $timeout) {
        // $window.localStorage.clear();
        var actualPasscode = ""; 

        $scope.$on('$ionicView.afterEnter', function(){
            LoginService.setInitialAccountDetails();
            $scope.notLoggedIn = true;
            
            LoginService.checkIfLoggedIn().then(function(bool){
                if(bool) {
                    // Already logged in, so skip the login
                    $scope.notLoggedIn = false;
                }
            });

            LoginService.getPassCode().then(function(code){
                actualPasscode = code;
            });
        });

        $scope.data = {};

        $scope.login = function(data) {
            if(data.username && data.password) {
                // First, retreive the user
                LoginService.getUser(data.username, data.password).then(function(response){   

                    // Then check if the user is authorized  
                    LoginService.login(response).then(function(authenticated) {
                        $scope.data.username = '';
                        $scope.data.password = '';
                        $scope.notLoggedIn = false;
                    }, function(err) {
                        var alertPopup = $ionicPopup.alert({
                            title: '<b>Login mislukt!</b>',
                            template: 'Controleer alstublieft uw logingegevens.'
                        });
                    });
                });
            }
        }

        $scope.passCodeError = false;
        $scope.passcode = "";

        $scope.add = function(value) {
            $scope.passCodeError = false;
            if($scope.passcode.length < 4) {
                $scope.passcode = $scope.passcode + value;
                if($scope.passcode.length == 4) {
                    $timeout(function() {
                        if($scope.passcode === actualPasscode) {
                            $window.location.replace('#/app/planning');
                        } else {
                            $scope.passcode = "";
                            $scope.passCodeError = true;
                        }
                    }, 500);
                }
            }
        }

        $scope.delete = function() {
            $scope.passCodeError = false;
            if($scope.passcode.length > 0) {
                $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
            }
        }

        $scope.$on('$ionicView.beforeLeave', function(){
            $scope.passcode = "";
        });
    });