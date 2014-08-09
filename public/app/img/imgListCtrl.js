(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$resource', '$location', imgListCtrl]);
    function imgListCtrl($scope, $resource, $location) {
        var vm = $scope;

        var ImgResource = $resource('/api/img/:_id', {_id : "@id"}, { });
        vm.imgs = ImgResource.query();
        vm.goToImg = function(img){
            $location.path();
        }
    }
})();