(function(){
    'use strict';

    var app = angular.module('app');

    app.factory('common', ['$q', '$timeout', '$http', '$location', common]);
    function common($q, $timeout, $http, $location) {

        var service = {
            $q: $q,
            $timeout: $timeout,
            $http: $http,
            $location: $location,
            // generic
            activateController: activateController
        };

        return service;

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                console.log('Activated controller: ' + controllerId);
                /*
                var data = { controllerId: controllerId };
                $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
                */
            });
        }


    }
})();