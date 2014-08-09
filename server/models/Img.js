var mongoose = require('mongoose');

var imgSchema = mongoose.Schema({
    code: {type: String, required: '{PATH} is required!'},
    date: {type: Date, required: '{PATH} is required!'},
    user_id: { type: String }
});

var Img = mongoose.model('Img', imgSchema);

exports.getImgs = function (req, res) {
    Img.find({}).exec(function (err, collection) {
        res.send(collection);
    });
}

exports.getImgByCode = function (code, callback) {
    Img.findOne({ code: code }).exec(callback);
}


exports.createImg = function(code){
    var imgData = {};
    imgData.code = code;
    imgData.date = new Date();
    imgData.user_id = '';
    Img.create(imgData, function(err, img){
        if(err){
            return false;
        }
        return img;
    });
}

exports.createDefaultImgs = function (){
    Img.find({}).exec(function(err, collection){
        if(collection.length === 0){
            //Course.create({code: '', date: new Date('10/5/2013'), user_id});
        }
    })
}

