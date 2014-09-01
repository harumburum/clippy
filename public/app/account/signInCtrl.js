(function () {
    'use strict';

    var controllerId = 'signInCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'mvAuth', signInCtrl]);
    function signInCtrl($scope, mvAuth) {
        var vm = $scope;
        vm.signIn = signIn;

        function signIn(){
            mvAuth.authenticateUser(vm.username, vm.password)
                .then(function(success){
                    if(success){
                        alert('You have successfully signed in');
                    } else {
                        alert('Failed to sing up');
                    }
                });
        };
    }
})();