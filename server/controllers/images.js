var mongoose = require('mongoose'),
    Image = mongoose.model('Image');

exports.getImages = function(req, res){
    var query = {};
    if(req.user){
        query.user_id = req.user._id.toString();
    } else {
        query.session_id = req.session.id;
    }
    Image.find(query).sort({data:-1}).exec(function(err, collection){
        if(err){
            //TODO: log error
            res.send(400);
        }
        res.send(collection);
    });
};

exports.deleteImage = function(req, res){
    if(!req.params.code){
        res.send(400);
    }
    //TODO: check user_id
    Image.remove({code: req.params.code}).exec(function(err){
        if(err){
            //TODO: log error
           res.send(400);
        }
        res.send(200);
    })
};

