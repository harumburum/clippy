var file        = require('./server/utilities/file');
var imageService = require('./server/services/image');
var thumbConfig = require('./server/config/thumb');


exports.create = function(srcFilePath, callback){
    if(!fs.existsSync(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    var fileStream = file.getStream(srcFilePath);
    var extension = file.getExtension(srcFilePath);
    imageService.getThumbBuffer(fileStream, thumbConfig.thumbSideSize, extension, function(thumbBuffer){

        callback()
    })
};
