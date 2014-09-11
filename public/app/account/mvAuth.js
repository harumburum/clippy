(function () {
    'use strict';

    var factoryId = 'mvAuth';
    angular.module('app').factory(factoryId, ['common', 'mvIdentity', 'mvUser', mvAuth]);
    function mvAuth(common, mvIdentity, mvUser) {
        var $q = common.$q;
        var $http = common.$http;

        return {
            createUser: function(newUserData){
                var newUser = new mvUser(newUserData);
                var dfr = $q.defer();

                newUser.$save().then(function(){
                    mvIdentity.currentUser = newUser;
                    dfr.resolve();
                }, function(response){
                    dfr.reject(response.data.reason);
                });

                return dfr.promise;
            },
            updateUser: function(userData){
                var dfr = $q.defer();
                var clone = angular.copy(mvIdentity.currentUser);
                angular.extend(clone, userData);
                clone.$update().then(function(){
                    mvIdentity.currentUser = clone;
                    dfr.resolve();
                }, function(response){
                    dfr.reject(response.data.reason);
                });
                return dfr.promise;
            },
            authenticateUser: function(username, password) {
                var dfd = $q.defer();
                $http.post('/login', {username:username, password:password}).then(function(response) {
                    if(response.data.success) {
                        var user = new mvUser();
                        angular.extend(user, response.data.user);
                        mvIdentity.currentUser = user;
                        dfd.resolve(true);
                    } else {
                        dfd.resolve(false);
                    }
                });
                return dfd.promise;
            },
            logoutUser: function() {
                var dfd = $q.defer();
                $http.post('/logout', { logout:true }).then(function() {
                    mvIdentity.currentUser = undefined;
                    dfd.resolve();
                });
                return dfd.promise;
            }
        }
    }
})();