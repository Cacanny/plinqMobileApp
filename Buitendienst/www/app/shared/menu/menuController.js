angular.module('directory.menuController', [])

    .controller('MenuCtrl', function ($scope, $window, MenuService, $ionicPopup) {
        $scope.$on('$ionicView.afterEnter', function(){
            MenuService.checkIfLoggedIn().then(function(bool){
                if(!bool){
                    $window.location.replace('#/login');
                } else {
                    MenuService.getUser().then(function(_user){
                        $scope.user = _user;
                    });
                }
            });
        });

        $scope.logout = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Uitloggen</b>',
                template: 'Weet u zeker dat u wilt uitloggen?<br/><br/>Houd er rekening mee dat de pincode ook gereset wordt.'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    MenuService.resetAccountDetails();
                    $window.location.replace('#/login');
                }
            });
        }
    });