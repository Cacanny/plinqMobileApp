angular.module('directory.ticketFilter', [])

    .filter('getSlice', function () {
        return function (input) {
            if (input.length > 50) {
                output = input.slice(0, 50) + '...';
            } else {
                output = input;
            }
            return output;
        }
    });