(function () {
    'use strict';

    var controllerId = 'profileCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'mvAuth', profileCtrl]);
    function profileCtrl($scope, common, mvAuth) {
        var vm = $scope;
        var $location = common.$location;

        vm.update = function(){
            var newUserData = {
                username: $scope.email,
                password: $scope.password
            };

            mvAuth.updateUser(newUserData).then(function(){
                $location.path('/');
            }, function(reason){
                alert(reason);
            });
        }
    }
})();