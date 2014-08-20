(function(){
    'use strict';

    var app = angular.module('app');

    app.factory('common', ['$q', '$timeout', '$http', common]);
    function common($q, $timeout, $http) {

        var service = {
            $q: $q,
            $timeout: $timeout,
            $http: $http,
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