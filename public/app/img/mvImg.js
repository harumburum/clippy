(function () {
    'use strict';

    var factoryId = 'mvImg';
    angular.module('app').factory(factoryId, ['$resource', mvImg]);
    function mvImg($resource) {
        var ImgResource = $resource('/api/imgs/:_id', {_id: "@id"}, {});

        return ImgResource;
    }
})();