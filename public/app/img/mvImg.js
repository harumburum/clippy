(function () {
    'use strict';

    var factoryId = 'mvImg';
    angular.module('app').factory(factoryId, ['$resource', mvImg]);
    function mvImg($resource) {
        var ImgResource = $resource('/api/images/:code', {code: "@code"}, {
            delete: {method: "DELETE", isArray: false}
        });
        return ImgResource;
    }
})();