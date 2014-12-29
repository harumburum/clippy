//Setup app
var express = require('express');
var app = express();
var multer = require('multer');
var http = require('http');
var file = require('./server/utilities/file');
var thumb = require('./server/utilities/thumb');

//Setup db
require('./server/config/mongoose')();


//Parse documents that send to the server
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Setup passport
require('./server/config/passport')();
var passport = require('passport');
var session = require('express-session');
app.use(session({
    name: 'session_id',
    secret: 'monkey code',
    saveUninitialized: true,
    resave: true,
    genid: function(req) {
        if(req.session && req.session.newSessionId){
            debugger;
            return req.session.newSessionId;
        }
        return keyGenerator.createGuid();
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//Setup logger
var morgan = require('morgan');
app.use(morgan());


//TODO: remove multiparty module
//TODO: remove imagemagik module

app.use(multer());

//Setup static files location
app.use(express.static(__dirname + '/public'));


//Setup view engine
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');


//Setup stylus middleware
var stylus = require('stylus');
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: function (str, path) {
            return stylus(str).set('filename', path);
       }
    }
));

var ImageModel = require('./server/models/Image');

//Setup application routes
var router = express.Router();

var images = require('./server/controllers/images');
router.get('/api/images', images.getImages);
router.delete('/api/images/:code', images.deleteImage);

var usersController = require('./server/controllers/users');
router.post('/api/users', usersController.createUser);
router.put('/api/users', usersController.updateUser);
router.get('/api/users/:username/exists', usersController.isExists);

auth = require('./server/config/auth');
app.post('/login', function(req, res, next){
    auth.authenticate('local', req, res, next);
});

app.post('/logout', function (req, res) {
    req.logout();
    res.end();
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', function(req, res, next){
        auth.authenticate('facebook', req, res, next);
      /*  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })(req, res, next);*/
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', function(req,res,next){
        passport.authenticate('twitter', { successRedirect: '/',
            failureRedirect: '/login' })(req,res,next);
});

var path = require('path');
var keyGenerator = require('./server/utilities/keyGenerator');
var storage = require('./server/config/storage');
router.post('/api/images', function (req, res) {
    var buffer = '';
    req.on('data', function (chunk) {
        buffer += chunk;
    }).on('end', function () {
        buffer = buffer.replace(/^data:image\/png;base64,/, "");
        var imageCode = keyGenerator.generate();
        var fullSizeImagePath = path.join(storage.storagePath, imageCode + '.png');

        file.createBase64File(fullSizeImagePath, buffer, fileCreated);

        function fileCreated() {
            thumb.create(fullSizeImagePath, function (responseData, hasError) {
                if (hasError) {
                    console.log("Response has error, returning 400. Error: " + responseData);
                    return res.send(400);
                }

                var thumbImagePath = path.join(storage.thumbStoragePath, imageName);
                file.createFile(thumbImagePath, responseData, function () {

                    var sessionId = req.session.id;
                    var image = {
                        code: imageCode,
                        extension: imageExtension,
                        size: imageSize,
                        session_id: sessionId
                    };
                    ImageModel.createImage(image, function (err, image) {
                        if (err) {
                            console.log("Error create image: " + err);
                            return false;
                        }
                        return res.send(image);
                    });
                })
            });
        }
    });
});

router.post('/upload', function (req, res) {
    if (req.files.file) {
        var tempFile = req.files.file;

        //TODO: validate image
        var imageCode = keyGenerator.generate();
        var imageSize = tempFile.size;
        var imageExtension = tempFile.extension.toLowerCase();
        var imageName = imageCode + '.' + imageExtension;
        var fullSizeImagePath = path.join(storage.storagePath, imageName);

        //copy temp file to storage
        file.copy(tempFile.path, fullSizeImagePath, fileCopied);

        function fileCopied() {
            //create thumb
            thumb.create(fullSizeImagePath, function (responseData, hasError) {
                if (hasError) {
                    console.log("Response has error, returning 400. Error: " + responseData);
                    try {
                        var error = JSON.parse(responseData + '');
                        return res.send(400, error.Message);
                    } catch (e) {
                        return res.send(400, "Service is not available.");
                        //TODO: anyway create image but add it to db as 'have no thumb'
                    }
                }

                var thumbImagePath = path.join(storage.thumbStoragePath, imageName);
                file.createFile(thumbImagePath, responseData, function () {
                    var image = {
                        code: imageCode,
                        extension: imageExtension,
                        size: imageSize
                    };

                    if(req.user){
                        image.user_id = req.user._id.toString();
                    } else {
                        image.session_id = req.session.id
                    }

                    ImageModel.createImage(image, function (err, image) {
                        if (err) {
                            console.log("Error create image: " + err);
                            return false;
                        }
                        return res.send(image);
                    });
                })
            });
        }
    }
});

//handle ui-bootstrap templates
router.get('/template/*', function (req, res) {
    var path = __dirname + '/public/vendor/ui-bootstrap/template/' + req.params[0];
    res.sendfile(path);
});

router.get('/partials/*', function (req, res) {
    res.render(__dirname + '/public/app/' + req.params[0]);
});

router.get('/image/thumb/*', function (req, res) {
    var imageName = req.params[0] || '';
    //TODO: check exist
    //TODO: validate

    var imagePath = path.join(storage.thumbStoragePath, imageName);
    res.sendfile(imagePath);
});

//TODO: refactor set image user_id
router.get('/image/*', function (req, res) {
    var imageName = (req.params[0] || '');
    var imagePath = path.join(storage.storagePath, imageName);
    res.sendfile(imagePath);

    /*var imgCode = (req.params[0] || '').replace('.png', '');
     var user_id = res.cookie['user_id'];
     console.log('code: ' + imgCode);
     ImageModel.getImageByCode(imgCode, function(err, img){
     if(img.user_id == ""){
     var guid = user_id || keyGenerator.createGuid();
     img.user_id = guid;
     img.save();
     res.cookie('user_id', guid);
     }
     var fileName = path.join(storage.storagePath,  imgCode + '.png');
     res.sendfile(fileName);
     });*/
});

router.get('/d/*', function (req, res) {
    //TODO: check file existence
    //TODO: check safe path, length
    //TODO: show 404

    var imageName = (req.params[0] || '');
    var imagePath = path.join(storage.storagePath, imageName);
    res.set('Content-disposition', 'attachment; filename=' + imageName);
    res.set('Content-type', 'application/octet-stream');
    res.sendfile(imagePath);
});

router.get('*', function (req, res) {
    res.render('index', { bootstrappedUser: req.user});
});
app.use('/', router);


//Run node
var port = 3030;
app.listen(port);
console.log('Magic happens on port ' + port + '...');