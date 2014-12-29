var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    code: {type: String, required: '{PATH} is required!'},
    extension: {type: String, required: '{PATH} is required!'},
    date: {type: Date, required: '{PATH} is required!', default: new Date()},
    size: {type: Number, required: '{PATH} is required!'},
    user_id: { type: String },
    session_id: { type: String }
});

var Image = mongoose.model('Image', imageSchema);

exports.getImages = function (req, res) {
    Image.find({}).sort({date:-1}).exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getImageByCode = function (code, callback) {
    Image.findOne({ code: code }).exec(callback);
};

exports.createImage = function(image, callback){
    Image.create(image, callback);
};

exports.assignImagesToUser = function(sessionId, userId, callback){
    Image.update({session_id: sessionId}, {user_id: userId, session_id: ''}, {multi: true}, callback)
};

exports.createDefaultImages = function (){
    Image.find({}).exec(function(err, collection){
        if(collection.length === 0){
            //Image.create({code: '', date: new Date('10/5/2013'), user_id});
        }
    })
};


