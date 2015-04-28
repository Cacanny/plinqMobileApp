angular.module('directory.ticketFilter', [])

    .filter('getSlice', function () {
        return function (input) {
            if (input.length > 20) {
                output = input.slice(0, 20) + '...';
            } else {
                output = input;
            }
            return output;
        }
    });