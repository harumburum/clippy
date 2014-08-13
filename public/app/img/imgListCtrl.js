(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$timeout', 'config', 'mvCachedImgs', imgListCtrl]);
    function imgListCtrl($scope, $timeout, config, mvCachedImgs) {
        var vm = $scope;
        vm.files = [];
        vm.imgs = mvCachedImgs.query();
        vm.canRemove = false;
        vm.toggleSelect = toggleSelect;
        vm.removeSelected = removeSelected;
        vm.openFileDialog = openFileDialog;
        vm.startUpload = startUpload;

        function openFileDialog(){
            $timeout(function() {
                angular.element('#file-upload').trigger('click');
            }, 100);
        }

        function startUpload(){
            if(vm.files.length == 0){
                return;
            }

            //TODO: validate file size
            var fd = new FormData()
            for(var i = 0; i < vm.files.length; i ++){
                var file = vm.files[i];
                if(file.size && file.size > config.maxUploadFileSize){
                    alert("Cant upload image" + file.name + ". Max file size is 20MB.")
                } else {
                    fd.append('file', file);
                }
            }

            //TODO: upload and show progress

        }

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