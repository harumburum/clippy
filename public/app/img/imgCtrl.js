(function () {
    'use strict';

    var controllerId = 'imgCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$routeParams', 'common', 'mvCachedImgs', imgCtrl]);
    function imgCtrl($scope, $routeParams, common, mvCachedImgs) {
        var vm = $scope;
        vm.imageCode = '';
        vm.image = {};

        function activate(){
            vm.imageCode = $routeParams.id;

            var promises = [getImageByCode(vm.imageCode)];
            common.activateController(promises, controllerId)
                .then(function () {  });
        }

        activate();

        function getImageByCode(code){
            return mvCachedImgs.query().$promise.then(function(images){
                images.forEach(function(image){
                    if(image.code === code){
                        vm.image = image;
                    }
                });
            });
        }
    }
})();