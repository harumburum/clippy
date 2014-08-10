(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$resource', 'mvCachedImgs', imgListCtrl]);
    function imgListCtrl($scope, $resource, mvCachedImgs) {
        var vm = $scope;
        vm.imgs = mvCachedImgs.query();
        vm.canRemove = false;
        vm.toggleSelect = toggleSelect;
        vm.removeSelected = removeSelected;

        function removeSelected(){
            if(!vm.canRemove){
                return;
            }

            //TODO: show confirmation dialog

            //TODO: remove action

            //TODO: hide removed

            vm.canRemove = false;
        }

        function toggleSelect(img){
            img.selected = !img.selected;
            if(img.selected){
                vm.canRemove = true;
                return;
            } else {
                var i = 0;
                for(i;i < vm.imgs.length;i++){
                    if(vm.imgs[i].selected){
                        vm.canRemove = true;
                        return;
                    }
                }
                vm.canRemove = false;
            }
        }


    }
})();