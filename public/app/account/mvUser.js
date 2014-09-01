(function () {
    'use strict';

    var factoryId = 'mvUser';
    angular.module('app').factory(factoryId, ['$resource', mvUser]);
    function mvUser($resource) {
        var UserResource = $resource('/api/users/:id', {_id: '@id'}, {
            update: { method: 'PUT', isArray:false }
        });

        return UserResource;
    }
})();