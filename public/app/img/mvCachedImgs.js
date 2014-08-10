(function () {
    'use strict';

    var factoryId = 'mvCachedImgs';
    angular.module('app').factory(factoryId, ['mvImg', mvCachedImgs]);
    function mvCachedImgs(mvImg) {
        var imgList;
        return {
            query: function(){
                if(!imgList){
                    imgList = mvImg.query();
                }
                return imgList;
            }
        }
    }
})();