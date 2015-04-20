describe('Controllers', function () {

    var scope;

    beforeEach(module('directory.controllers'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        $controller('AppCtrl', { $scope: scope });
    }));

    it('should have friendsEnabled set to true', function () {
        expect(scope.settings.friendsEnabled).toEqual(true);
    });
});