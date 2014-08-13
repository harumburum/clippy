(function(){
    'use strict'

    var app = angular.module('app');

    var config = {
        maxUploadFileSize : 20 * 1024 * 1024
    }

    app.value('config', config);

})();