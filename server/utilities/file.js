var fs = require('fs');

exports.copy = function(srcFilePath, desFilePath, callback){
    if(!fs.existsSync(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    var readStream = fs.createReadStream(srcFilePath);
    var writeStream = fs.createWriteStream(desFilePath);
    readStream.pipe(writeStream);
    readStream.on('end', function() {
        callback();
    });
};

exports.getStream = function(srcFilePath, callback){
    if(!fs.existsSync(srcFilePath)){
        throw new Error("File '" + srcFilePath +"' was not found.");
    }
    fs.readFile(srcFilePath, function(err, data){
        if(err){
            callback(err);
        }
        callback(data);
    });
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
