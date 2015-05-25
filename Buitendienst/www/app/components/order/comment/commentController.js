angular.module('directory.commentController', [])

    .controller('CommentCtrl', function ($scope, CommentService, $ionicPopup) {    
        function checkComments() {
            CommentService.getComment($scope.order.orderid).then(function(comment){
                $scope.comment = comment;
            });
        }
        checkComments();

        $scope.change = function() {
            CommentService.setComment($scope.order.orderid, document.getElementById('comment').value);
        }

        $scope.deleteComment = function() {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Verwijder Opmerking</b>',
                template: 'Wilt u de opmerking verwijderen?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    document.getElementById('comment').value = '';
                    CommentService.setComment($scope.order.orderid, document.getElementById('comment').value);
                }
            });
        }
    });
