(function () {
    'use strict';

    var controllerId = 'navbarLoginCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'mvIdentity', 'mvAuth', navbarLoginCtrl]);
    function navbarLoginCtrl($scope, mvIdentity, mvAuth, $location) {
        var vm = $scope;
        vm.identity = mvIdentity;
        vm.signout = signout;

        function signout(){
            mvAuth.logoutUser().then(function(success){
                $scope.username = '';
                $scope.password = '';
                alert('Successfully signed out');
                $location.path('/');
            });
        }
s    }
})();