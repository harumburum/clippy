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
    return fs.readFileSync(srcFilePath);
};


exports.createFile = function(filePaht, buffer, callback){
    fs.writeFile(filePaht, buffer, function(err){
        callback();
    });
};

exports.getExtension = function(srcFilePath){
    return srcFilePath.split('.').pop();
};

exports.exists = function(srcFilePath){
    return fs.existsSync(srcFilePath);
};
