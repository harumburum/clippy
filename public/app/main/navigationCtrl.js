(function () {
    'use strict';

    var controllerId = 'navigationCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'mvIdentity', 'mvAuth', navigationCtrl]);
    function navigationCtrl($scope, common, mvIdentity, mvAuth) {
        var $q = common.$q;
        var $location = common.$location;
        var $timeout = common.$timeout;

        var vm = this;
        vm.signOut = signOut;

        activate();

        function activate() {
            var promises = [refreshUserData()];
            common.activateController(promises, controllerId)
                .then(function () { });
        }

        function refreshUserData(){
            var dfd = $q.defer();
            $timeout(function(){
                vm.isAuthenticated = mvIdentity.isAuthenticated();
                if(vm.isAuthenticated) {
                    vm.username = mvIdentity.currentUser.username;
                }
                dfd.resolve();
            }, 100);
            return dfd.promise;
        }

        function signOut(){
            mvAuth.logoutUser().then(function(success){
                /*alert('Successfully signed out');*/
                $location.path('/');
            }, function(){
                /*alert('Error signed out');*/
            });
        }

        $scope.$watch(function () {
            return mvIdentity.currentUser;
        }, function () {
            $q.when(refreshUserData());
        });
    }
})();