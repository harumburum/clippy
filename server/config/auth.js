var passport = require('passport'),
    Image = require('../models/Image');

exports.authenticate =  function (provider, req, res, next) {
    if(req.body && req.body.username){
        req.body.username = req.body.username.toLowerCase();
    }
    var auth = passport.authenticate(provider, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.send({success: false});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            //TODO: should be for all auth methods
            Image.assignImagesToUser(req.session.id, req.user._id, function (err) {
                if (err) {
                    return next(err);
                }
                if(provider == 'local'){
                    res.send({success: true, user: user});
                } else {
                    res.redirect('/');
                }
            });
        });
    });

    auth(req, res, next);
};

exports.requiresApiLogin = function(req, res, next){
    if (!req.isAuthenticated) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};