(function () {
    'use strict';

    var factoryId = 'mvIdentity';
    angular.module('app').factory(factoryId, ['$window', 'mvUser', mvIdentity]);
    function mvIdentity($window, mvUser) {
        var currentUser;
        if(!!$window.bootstrappedUser){
            currentUser = new mvUser();
            angular.extend(currentUser, $window.bootstrappedUser);
        }
        return {
            currentUser: currentUser,
            isAuthenticated: function(){
                return !!this.currentUser;
            }
        };
    }
})();