var mongoose = require('mongoose');

var imgSchema = mongoose.Schema({
    code: {type: String, required: '{PATH} is required!'},
    date: {type: Date, required: '{PATH} is required!'},
    size: {type: Number, required: '{PATH} is required!'},
    user_id: { type: String }
});

var Img = mongoose.model('Img', imgSchema);

var sort = {
    asc : 1,
    desc: 1
}
exports.getImgs = function (req, res) {
    Img.find({}, ['code', 'date', 'size'], { sort : {date:-1}}).exec(function (err, collection) {
        res.send(collection);
    });
}

exports.getImgByCode = function (code, callback) {
    Img.findOne({ code: code }).exec(callback);
}


exports.createImg = function(code, size, callback){
    var imgData = {};
    imgData.code = code;
    imgData.date = new Date();
    imgData.user_id = '';
    imgData.size = size;
    return Img.create(imgData, function(err, img){
        if(err){
            callback(false);
        }
        callback(img);
    });
}

exports.createDefaultImgs = function (){
    Img.find({}).exec(function(err, collection){
        if(collection.length === 0){
            //Course.create({code: '', date: new Date('10/5/2013'), user_id});
        }
    })
}

