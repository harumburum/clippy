(function () {
    'use strict';

    var controllerId = 'signUpCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'mvAuth', signUpCtrl]);
    function signUpCtrl($scope, common, mvAuth) {
        var vm = $scope;
        var $location = common.$location;

        vm.signup = function(){
            var newUserData = {
                username: $scope.email,
                password: $scope.password
            };

            mvAuth.createUser(newUserData).then(function(){
                alert('User account created');
              /*  $location.path('/');*/
            }, function(reason){
                alert(reason);
            });
        }
    }
})();