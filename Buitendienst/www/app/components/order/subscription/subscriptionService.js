angular.module('directory.subscriptionService', [])
.factory('SubscriptionService', function ($q, $http, $window, $ionicPopup) {

    return {

        sendPortingTrue: function(porting) {
            return $http.post("test.json", porting) // CHANGE test.json TO THE API URL
                .success(function (response) {
                    var alertPopup = $ionicPopup.alert({
                        title: '<b>Succes!</b>',
                        template: 'U heeft succesvol doorgegeven dat de portering geactiveerd kan worden.'
                    });
                })
                .error(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: '<b>Fout!</b>',
                        template: 'Er is iets fout gegaan. Controleer uw internetverbinding en probeer daarna opnieuw.'
                    });
                });
        }
    }

});