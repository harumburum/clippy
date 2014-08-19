(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$timeout', '$http', 'config', 'mvImg', 'mvCachedImgs', imgListCtrl]);
    function imgListCtrl($scope, $timeout, $http, config, mvImg, mvCachedImgs) {
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

            var filesToUpload = [];
            for(var i = 0; i < vm.files.length; i ++){
                var file = vm.files[i];
                if(file.size && file.size > config.maxUploadFileSize){
                    alert("Cant upload image" + file.name + ". Max file size is 20MB.")
                } else {
                    filesToUpload.push(file);
                }
            }
            if(filesToUpload.length == 0){
                return;
            }

            vm.isUploading = true;
            var counter = 0;
            for(var i = 0; i < filesToUpload.length; i ++){
                var fd = new FormData();
                fd.append('file', filesToUpload[i]);
                $http.post('upload', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type':undefined}
                    }
                ).success(function(image) {
                   counter += 1;
                   vm.uploadText = "Uploading " + counter + " of " + filesToUpload.length;
                   $scope.$apply();
                   if(counter === filesToUpload.length){
                       vm.uploadText = 'Upload Completed';
                       $scope.$apply();
                       $timeout(function() {
                           vm.isUploading = false;
                           vm.uploadText = 'Upload Image';
                           $scope.$apply();
                       }, 1000);
                   }
                   vm.imgs.unshift(image);
                }).error(function(err){
                    alert(err);
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
            for(var i = vm.imgs.length - 1; i >= 0 ; i --){
                var img = vm.imgs[i];
                var index = 0;
                if(img.selected) {
                    mvImg.delete({code:img.code},function(err){
                        vm.imgs.splice(index + 1, 1);
                    });
                }
            }
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