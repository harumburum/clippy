var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    enums = require('../models/Enums');


var User = mongoose.model('User');

module.exports = function () {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}).exec(function (err, user) {
                if (user && user.authenticate(password)) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: '469548549840366',
            clientSecret: '3d566624b53ca577d7c4cc4c6096844e',
            callbackURL: "http://localhost:3030/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'facebook_id': profile.id }).exec(function (err, user) {
                if (!user) {
                    user = new User({
                        username: profile.username,
                        facebook_id: profile.id,
                        user_type: enums.userType.Facebook
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    ));

    passport.use(new TwitterStrategy({
            consumerKey: 'rdtbUg6nX76LJIeLP8vAl2Hbs',
            consumerSecret: '0kiOh3wgEeqUY5CPvThGFh8k5WRauUEtePsyxp9C6XOLOy0WTV',
            callbackURL: "http://localhost:3030/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({ 'twitter_id': profile.id }).exec(function (err, user) {
                if (!user) {
                    user = new User({
                        username: profile.username,
                        twitter_id: profile.id,
                        user_type: enums.userType.Twitter
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    ));



    passport.serializeUser(function (user, done) {
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}).exec(function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });

};