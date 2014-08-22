var file         = require('./file');
var imageService = require('./../services/image');
var thumbConfig  = require('./../config/thumb');


exports.create = function(srcFilePath, callback){
    if(!file.exists(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    file.getStream(srcFilePath, function(buffer){
        var extension = file.getExtension(srcFilePath);
        imageService.getThumbBuffer(buffer, thumbConfig.thumbSideSize, extension, callback)
    });
};
