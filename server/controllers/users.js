var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    encryption = require('../utilities/encryption'),
    validation = require('../utilities/validation');

exports.isExists = function (req, res) {
    console.log();
    var username = req.params.username;
    console.log("isExists: '" + username + "'");
    if(!username || username.length === 0){
        console.log("isExists: empty");
        return res.send(false);
    }
    if(!validation.isEmail(username)){
        console.log("isExists: not an email");
        return res.send(false);
    }
    User.count({username: username}).exec(function (err, count) {
        var exists = count > 0;
        return res.send(exists);
    });
};

exports.getUsers = function (req, res) {
    User.find({}).exec(function (err, collection) {
        res.send(collection);
    });
};

exports.createUser = function(req, res, next){
    var userData = req.body;

    userData.username = userData.username.toLowerCase();
    userData.salt = encryption.createSalt();
    userData.hash_pwd = encryption.hashPwd(userData.salt, userData.password);

    User.create(userData, function(err, user){
        if(err){
            if(err.toString().indexOf('E11000') > -1){
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason: err.toString()});
        }
        req.logIn(user, function(err){
            if(err) { return next(err);}
            res.send(user);
        })
    });
};

exports.updateUser = function(req, res, next){
    var userUpdates = req.body;
    if(req.user._id != userUpdates._id){
        res.status(403);
        return res.end();
    }
    if(userUpdates.username && userUpdates.username.length > 0 && userUpdates.username !== req.user.username) {
        req.user.username = userUpdates.username.toLowerCase();
    }

    if(userUpdates.password && userUpdates.password.length > 0){
        req.user.salt = encryption.createSalt();
        req.user.hash_pwd = encryption.hashPwd(req.user.salt, userUpdates.password);
    }

    req.user.save(function(err){
        if(err){ res.status(400); res.send({reason: err.toString()})}
        res.send(req.user);
    })
};