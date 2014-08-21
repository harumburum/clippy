var fs = require('fs');

exports.copy = function(srcFilePath, desFilePath){
    if(!fs.existsSync(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    var readStream = fs.createReadStream(srcFilePath);
    var writeStream = fs.createWriteStream(desFilePath);
    readStream.pipe(writeStream);
};

exports.getStream = function(srcFilePath){
    if(!fs.existsSync(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    return sfs.readFileSync(fullSizeImage);
};


exports.createFile = functin(filePaht, buffer, callback){
    fs.writeFile(filePaht, buffer, function(err){
        callback();
    });
};

exports.getExtension = function(srcFilePath){
    return srcFilePath.split('.').pop();
};
