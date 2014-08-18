(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$timeout', '$http', 'config', 'mvCachedImgs', imgListCtrl]);
    function imgListCtrl($scope, $timeout, $http, config, mvCachedImgs) {
        var vm = $scope;
        vm.files = [];
        vm.imgs = mvCachedImgs.query();
        vm.canRemove = false;
        vm.toggleSelect = toggleSelect;
        vm.removeSelected = removeSelected;
        vm.openFileDialog = openFileDialog;
        vm.isUploading = false;
        vm.uploadText = 'Upload Image';

        function openFileDialog(){
            $timeout(function() {
                angular.element('#file-upload').trigger('click');
            }, 100);
        }

        vm.$on('startUpload', startUpload);
        function startUpload(){
            if(vm.files.length == 0){
                return;
            }

            //TODO: validate file size
            var filesToUpload = [];
            for(var i = 0; i < vm.files.length; i ++){
                var file = vm.files[i];
                if(file.size && file.size > config.maxUploadFileSize){
                    alert("Cant upload image" + file.name + ". Max file size is 20MB.")
                } else {
                    filesToUpload.push(file);
                }
            }
            //TODO: upload and show progress
            //TODO: upload and show progress
            if(filesToUpload.length == 0){
                return;
            }
            vm.isUploading = true;
            for(var i = 0; i < filesToUpload.length; i ++){
                vm.uploadText = "Uploading " + (i + 1) + " of " + filesToUpload.length;

                var fd = new FormData();
                fd.append('file', filesToUpload[i]);
                $http.post('upload', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type':undefined}
                    }
                ).success(function(image) {
                    vm.imgs.unshift(image);
                }).error( function(err){
                    console.log(err);
                });
            }
        }

        function removeSelected(){
            if(!vm.canRemove){
                return;
            }

            //TODO: replace with bootstrap dialog
            if(!confirm("Are you sure you want to delete?")){
                return;
            }

            //TODO: collect data to remove
            var imgCodesToRemove = [];
            for(var i = 0; i < vm.imgs.length; i ++){
                var img = vm.imgs[i];
                if(img.selected) {
                    imgCodesToRemove.push(img.code);
                }
            }

            //TODO: remove
            $http.remove('api/images')
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