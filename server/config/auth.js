var passport = require('passport');

exports.authenticate =  function (req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function (err, user) {
        if (err) { return next(err); }
        if (!user) { res.send({success: false}); }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            else{
                res.send({success: true, user: { username: user['username'] }});
            }
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