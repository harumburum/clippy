var mongoose = require('mongoose'),
    imageModel = require('../models/Image'),
    userModel = require('../models/User');

module.exports = function(){
    mongoose.connect('mongodb://localhost/img2net');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Database connection error...'));
    db.once('open', function callback() {
        console.log("Database connection opened...")
    });

    imageModel.createDefaultImages();
    userModel.createDefaultUsers();
};