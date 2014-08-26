(function(){
    'use strict'

    var app = angular.module('app');

    var config = {
        maxUploadFileSize : 20 * 1024 * 1024,
        uploadFileExtensions: ['png', 'jpg', 'jpeg']
    };

    app.value('config', config);

})();