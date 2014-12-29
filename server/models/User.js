var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption'),
    enums = require('../models/enums');

var userSchema = mongoose.Schema({
    username: {type: String, required: '{PATH} is required!', unique: true},
    salt: {type: String},
    hash_pwd: {type: String},
    user_type: {type:  String, default: enums.userType.Local},
    facebook_id: {type: String},
    twitter_id: {type: String}
});

userSchema.methods = {
    authenticate: function (passwordToMath) {
        return encryption.hashPwd(this.salt, passwordToMath) === this.hash_pwd;
    }
};

var User = mongoose.model('User', userSchema);

exports.createDefaultUsers = function (){
    User.find({}).exec(function(err, collection){
        if(collection.length === 0){
            //User.create({username: ''});
        }
    })
};