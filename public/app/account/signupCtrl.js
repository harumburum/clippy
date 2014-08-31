(function () {
    'use strict';

    var controllerId = 'signUpCtrl';
    angular.module('app').controller(controllerId, ['$scope', signUpCtrl]);
    function signUpCtrl($scope) {
        var vm = $scope;
        vm.signup = function(){
            var newUserData = {
                username: $scope.email,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName
            };

            mvAuth.createUser(newUserData).then(function(){
                mvNotifier.notify('User account created');
                $location.path('/');
            }, function(reason){
                mvNotifier.error(reason);
            });
        }

    }
})();