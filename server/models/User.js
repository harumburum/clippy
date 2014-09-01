var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    //user_id: { type: String },
    username: {type: String, required: '{PATH} is required!', unique: true},
    salt: {type: String, required: '{PATH} is required!'},
    hash_pwd: {type: String, required: '{PATH} is required!'}
});

userSchema.methods = {
    authenticate: function (passwordToMath) {
        console.log(this.hash_pwd);
        console.log(encryption.hashPwd(this.salt, passwordToMath));
        return encryption.hashPwd(this.salt, passwordToMath) === this.hash_pwd;
    }
};

var User = mongoose.model('User', userSchema);

exports.createDefaultUsers = function (){
    User.find({}).exec(function(err, collection){
        if(collection.length === 0){
            //Image.create({code: '', date: new Date('10/5/2013'), user_id});
        }
    })
};