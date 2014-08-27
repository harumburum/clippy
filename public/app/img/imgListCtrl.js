(function () {
    'use strict';

    var controllerId = 'imgListCtrl';
    angular.module('app').controller(controllerId, ['$scope', 'common', 'config', 'mvImg', 'mvCachedImgs', '$modal', imgListCtrl]);
    function imgListCtrl($scope, common, config, mvImg, mvCachedImgs, $modal) {
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

        function activate() {
            var promises = [getImages()];
            common.activateController(promises, controllerId)
                .then(function () {
                });
        }

        activate();

        function getImages() {
            return mvCachedImgs.query().$promise.then(function (images) {
                vm.images = images;
                _refreshRemoveButton();
            });
        }

        function openFileDialog() {
            common.$timeout(function () {
                angular.element('#file-upload').trigger('click');
            }, 100);
        }

        vm.$on('startUpload', startUpload);
        function startUpload() {
            if (vm.files.length == 0) {
                return;
            }

            var filesToUpload = [];
            for (var i = 0; i < vm.files.length; i++) {
                var file = vm.files[i];
                if (file.size && file.size > config.maxUploadFileSize) {
                    alert("Cant upload image" + file.name + ". Max file size is 20MB.");
                } else {
                    filesToUpload.push(file);
                }
            }
            if (filesToUpload.length == 0) {
                return;
            }

            vm.isUploading = true;
            function uploadFilesOneByOne() {
                if (filesToUpload.length === 0) {
                    return;
                }
                var file = filesToUpload.shift();
                var fd = new FormData();
                fd.append('file', file);
                common.$http.post('upload', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }
                ).success(function (image) {
                        vm.images.unshift(image);
                        //TODO: refactor to completed
                        uploadFilesOneByOne()
                    }).error(function () {
                        alert("Upload failed.");
                        uploadFilesOneByOne();
                    });
            }

            uploadFilesOneByOne();

            vm.isUploading = false;

            //let directive know that we finished
            vm.$emit('finishUpload');
        }

        function remove(image) {
            if (!confirm("Are you sure you want to remove?")) {
                return;
            }

            mvImg.delete({code: image.code}, function (err) {
                _removeImageFromList(image);
                _refreshRemoveButton();
            });
        }

        function toggleSelect(img) {
            img.selected = !img.selected;
            if (img.selected) {
                vm.canRemove = true;
                return;
            } else {
                var i = 0;
                for (i; i < vm.images.length; i++) {
                    if (vm.images[i].selected) {
                        vm.canRemove = true;
                        return;
                    }
                }
                vm.canRemove = false;
            }
        }

        function removeSelected() {
            if (!vm.canRemove) {
                return;
            }

            //TODO: replace with bs dialog
            if (!confirm("Are you sure you want to remove?")) {
                return;
            }

            var imagesToDelete = [];
            for (var i = vm.images.length - 1; i >= 0; i--) {
                var img = vm.images[i];
                if (img.selected) {
                    imagesToDelete.unshift(img);
                }
            }

            function deleteImagesOnyByOne() {
                if (imagesToDelete.length === 0) {
                    return;
                }
                var image = imagesToDelete.shift();
                mvImg.delete({code: image.code}, function (err) {
                    _removeImageFromList(image);
                    deleteImagesOnyByOne();
                });
            }

            deleteImagesOnyByOne();

            vm.canRemove = false;
        }

        function _removeImageFromList(image) {
            for (var i = 0; i < vm.images.length; i++) {
                if (vm.images[i].code === image.code) {
                    vm.images.splice(i, 1);
                    return;
                }
            }
        }

        function _refreshRemoveButton() {
            for (var i = 0; i < vm.images.length; i++) {
                if (vm.images[i].selected) {
                    vm.canRemove = true;
                    return;
                }
            }
            vm.canRemove = false;
        }

        //modal

        $scope.items = ['item1', 'it    em2', 'item3'];

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'app/img/dialogs/embedFileDlg.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }

    var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

})();