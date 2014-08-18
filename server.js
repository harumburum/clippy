//Setup app
var express = require('express');
var app     = express();
var multer  = require('multer');
app.use(multer(/*{ dest: './uploads/'}*/));

//Setup static files location
app.use(express.static(__dirname + '/public'));


//Setup view engine
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade')

//Parse documents that send to the server
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


//Setup logger
var morgan = require('morgan');
app.use(morgan());

//Setup stylus middleware
var stylus  = require('stylus');
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: function(str, path){
            return stylus(str).set('filename', path);
        }
    }
));


//Setup db
var mongoose = require('mongoose'),
    imgModel = require('./server/models/Image');

mongoose.connect('mongodb://localhost/img2net');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error...'));
db.once('open', function callback(){
    console.log("Database connection opened...")
});

//Setup application routes
var router  = express.Router();

var images = require('./server/controllers/images');
router.get('/api/images', images.getImages);
router.delete('/api/images', images.deleteImage);



var fs = require('fs');
var path = require('path');
var unique = require('./server/utilities/unique');
var storage = require('./server/config/storage');
var im = require('imagemagick');
var uniqueImageIdLenght = 5;
router.post('/api/images', function(req, res, next) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    }).on('end', function(){
        data = data.replace(/^data:image\/png;base64,/, "");
        var imgCode = unique.createString(uniqueImageIdLenght);
        var fileName = path.join(storage.storagePath, imgCode + '.png');
        fs.writeFile(fileName, data, 'base64', function(err) {
            console.log(err);
        });
        //TODO: create thumbnail
        var thumbFileName = path.join(storage.thumbStoragePath, imgCode + '.png');

        console.log(fileName);
        console.log(thumbFileName);

        //max height 150px
        //max width 253px
        var buffer = new Buffer(data, 'base64');
        var w = buffer.readUInt32BE(16);
        var h = buffer.readUInt32BE(20);
        console.log(w)
        console.log(h)

        //TODO: get width of thumb
        var maxWidth = 253;
        var maxHeight = 150;
        var thumbWidth = 0;
        if(w > h){ //maz width
            thumbWidth = maxWidth;
        } else {
            thumbWidth = maxHeight / (h / w);
        }

        console.log(thumbWidth);

            im.resize({
                srcPath: fileName,
                dstPath: thumbFileName,
                width:   thumbWidth
            }, function(err, stdout, stderr){
                if (err) throw err;
                console.log('resized kittens.jpg to fit within 256x256px');
            });
        /*});*/


        //TODO: save to db
        imgModel.createImg(imgCode, data.length);
        res.send(imgCode);
    });
});

//var multiparty = require('multiparty');
var http = require('http');
var url = require('url');
router.post('/upload', function(req, res, next) {
    if(req.files.file){
        var file = req.files.file;
        var ext = file.extension;
        var imgCode = unique.createString(uniqueImageIdLenght);
        var fn = (imgCode + '.' + ext);
        var fileName = path.join(storage.storagePath, fn);

        fs.createReadStream(file.path).pipe(fs.createWriteStream(fileName));

        var data = fs.readFileSync(file.path);

        var request_url = url.parse("http://kyliavlob.com/api/images?width=250");

        var options = {
            method: "POST",
            protocol: request_url.protocol,
            port: request_url.port,
            hostname: request_url.hostname,
            path: request_url.path,
            headers: {
                Accepts: 'application/json'
            }
        };

        if (data) {
            options.headers['Content-Length'] = data.length;
        } else {
            options.headers['Content-Length'] = 0;
        }

        var response_buffer = null;
        var request = http.request(options);

        request.on('response', function(response) {
            response.on('data', function(chunk) {
                if (response_buffer) {
                    if (typeof (Buffer.concat) === 'function') {
                        response_buffer = Buffer.concat([response_buffer, chunk]);
                    } else {
                        var holder = new Buffer(response_buffer.length + chunk.length);
                        response_buffer.copy(holder);
                        chunk.copy(holder, response_buffer.length);
                        response_buffer = holder;
                    }
                } else {
                    response_buffer = chunk;
                }
            });

            response.on('end', function() {
                if (typeof callback === 'function') {
                    callback.call(null, json);
                }
                var thumbFileName = path.join(storage.thumbStoragePath, imgCode + '.png');
                fs.writeFile(thumbFileName, response_buffer, function(err) {
                    console.log(err);
                });
                imgModel.createImage(imgCode, file.size, function(img){
                    res.send(img);
                });
            });
        });

        if (data) {
            request.end(data);
        } else {
            request.end();
        }
    }
});

router.get('/partials/*', function(req, res){
    res.render(__dirname + '/public/app/' + req.params[0]);
});

router.get('/image/thumb/*', function(req, res){
    var imgCode = (req.params[0] || '').replace('.png', '');
    var user_id = res.cookie['user_id'];
    console.log('code: ' + imgCode);
    imgModel.getImgByCode(imgCode, function(err, img){
        if(img.user_id == ""){
            var guid = user_id || unique.createGuid();
            img.user_id = guid;
            img.save();
            res.cookie('user_id', guid);
        }
        var fileName = path.join(storage.thumbStoragePath,  imgCode + '.png');
        res.sendfile(fileName);
    });
});

router.get('/image/*', function(req, res){
    var imgCode = (req.params[0] || '').replace('.png', '');
    var user_id = res.cookie['user_id'];
    console.log('code: ' + imgCode);
    imgModel.getImgByCode(imgCode, function(err, img){
        if(img.user_id == ""){
            var guid = user_id || unique.createGuid();
            img.user_id = guid;
            img.save();
            res.cookie('user_id', guid);
        }
        var fileName = path.join(storage.storagePath,  imgCode + '.png');
        res.sendfile(fileName);
    });
});

router.get('/d/*', function(req, res){
    //TODO: check file existence
    //TODO: check safe path, length
    //TODO: show 404

    var imgCode = (req.params[0] || '').replace('.png', '');
    var fileName = path.join(storage.storagePath,  imgCode + '.png');
    res.set('Content-disposition', 'attachment; filename=' + imgCode + '.png');
    res.set('Content-type', 'application/octet-stream');
    res.sendfile(fileName);
});

router.get('*', function(req, res){
    res.render('index', { });
});
app.use('/', router);


//Run node
var port = 3030;
app.listen(port);
console.log('Magic happens on port ' + port + '...');