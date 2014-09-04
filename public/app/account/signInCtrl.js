(function () {
    'use strict';

    var controllerId = 'signInCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'mvAuth', signInCtrl]);
    function signInCtrl($scope, common, mvAuth) {
        var $location = common.$location;

        var vm = $scope;
        vm.signIn = signIn;

        function signIn(){
            mvAuth.authenticateUser(vm.email, vm.password)
                .then(function(success){
                    if(success){
                        $location.path('/img');
                    } else {
                        //TODO: refactor to show error message
                        alert('Failed to sing up');
                    }
                });
        }
    }
})();