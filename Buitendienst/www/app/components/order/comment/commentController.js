angular.module('directory.commentController', [])

    .controller('CommentCtrl', function ($scope, CommentService) {    
        function checkComments() {
            CommentService.getComment($scope.order.orderid).then(function(comment){
                $scope.comment = comment;
            });
        }
        checkComments();

        $scope.change = function() {
            CommentService.setComment($scope.order.orderid, document.getElementById('comment').value);
        }
    });
