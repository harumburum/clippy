(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'config', 'mvImg', 'mvCachedImgs', imgListCtrl]);
    function imgListCtrl($scope, common, config, mvImg, mvCachedImgs) {
        var vm = $scope;
        vm.files = [];
        vm.images = [];
        vm.canRemove = false;
        vm.toggleSelect = toggleSelect;
        vm.removeSelected = removeSelected;
        vm.remove = remove;
        vm.openFileDialog = openFileDialog;
        vm.isUploading = false;
        vm.uploadText = 'Upload';

        function activate(){
            var promises = [getImages()];
            common.activateController(promises, controllerId)
                .then(function () {  });
        }

        activate();

        function getImages(){
            var dfd = common.$q.defer();
            common.$timeout(function(){
                vm.images = mvCachedImgs.query();
                _refreshRemoveButton();
                dfd.resolve(true);
            }, 100);
            return dfd.promise;
        }

        function openFileDialog(){
            common.$timeout(function() {
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
                common.$http.post('upload', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type':undefined}
                    }
                ).success(function(image) {
                   counter += 1;
                   vm.uploadText = "Uploading " + counter + " of " + filesToUpload.length;
                   if(counter === filesToUpload.length){
                       vm.uploadText = 'Upload Completed';
                       common.$timeout(function() {
                           vm.isUploading = false;
                           vm.uploadText = 'Upload';
                       }, 1000);
                   }
                   vm.images.unshift(image);
                }).error(function(err){
                    alert(err);
                });
            }
            vm.$emit('finishUpload');
        }

        function remove(image){
            if(!confirm("Are you sure you want to remove?")){
                return;
            }

            mvImg.delete({code:image.code},function(err){
                _removeImageFromList(image);
                _refreshRemoveButton();
            });
        }

        function toggleSelect(img){
            img.selected = !img.selected;
            if(img.selected){
                vm.canRemove = true;
                return;
            } else {
                var i = 0;
                for(i;i < vm.images.length;i++){
                    if(vm.images[i].selected){
                        vm.canRemove = true;
                        return;
                    }
                }
                vm.canRemove = false;
            }
        }

        function removeSelected(){
            if(!vm.canRemove){
                return;
            }

            //TODO: replace with bs dialog
            if(!confirm("Are you sure you want to remove?")){
                return;
            }

            var imagesToDelete = [];
            for(var i = vm.images.length - 1; i >= 0 ; i --){
                var img = vm.images[i];
                if(img.selected) {
                    imagesToDelete.unshift(img);
                }
            }

            function deleteImagesOnyByOne(){
                if(imagesToDelete.length === 0){ return; }
                var image = imagesToDelete.shift();
                mvImg.delete({code:image.code},function(err){
                    _removeImageFromList(image);
                    deleteImagesOnyByOne();
                });
            }

            deleteImagesOnyByOne();

            vm.canRemove = false;
        }

        function _removeImageFromList(image){
            for(var i = 0; i < vm.images.length; i++){
                if(vm.images[i].code === image.code){
                    vm.images.splice(i, 1);
                    return;
                }
            }
        }

        function _refreshRemoveButton(){
            for(var i = 0; i < vm.images.length; i++){
                if(vm.images[i].selected){
                    vm.canRemove = true;
                    return;
                }
            }
            vm.canRemove = false;
        }
    }
})();