var mongoose = require('mongoose'),
    Image = mongoose.model('Image');

exports.getImages = function(req, res){
    Image.find({}).sort({data:-1}).exec(function(err, collection){
        if(err){
            //TODO: log error
        }
        res.send(collection);
    });
};

exports.deleteImage = function(req, res){
    if(!req.params.id){
        res.send(400);
    }
    //TODO: check documentation
    Image.remove({code: req.params.id}).exec(function(err){
        if(err){
            //TODO: log error
           res.send(400);
        }
        res.send(200);
    })
};

