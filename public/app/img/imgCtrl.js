(function () {
    'use strict';

    var controllerId = 'imgCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$routeParams', imgCtrl]);
    function imgCtrl($scope, $routeParams) {
        var vm = $scope;
        vm.imgCode = $routeParams.id;
    }
})();