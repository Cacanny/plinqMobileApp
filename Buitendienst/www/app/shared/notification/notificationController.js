angular.module('directory.notificationController', [])

    .controller('NotificationCtrl', function ($scope) {
        var date = new Date();
        $scope.time = convertTime(date);

        function convertTime(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getHours()), pad(d.getMinutes())].join(':');
        }
    });