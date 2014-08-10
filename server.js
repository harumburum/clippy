//Setup app
var express = require('express');
var app     = express();

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
    imgModel = require('./server/models/Img');

mongoose.connect('mongodb://localhost/img2net');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error...'));
db.once('open', function callback(){
    console.log("Database connection opened...")
});




var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
Message.findOne().exec(function(err, messageDoc){  });

//Setup application routes
var router  = express.Router();

var fs = require('fs');
var path = require('path');
var unique = require('./server/utilities/unique');
var storage = require('./server/config/storage');
var im = require('imagemagick');
var uniqueImageIdLenght = 5;
router.post('/api/imgs', function(req, res, next) {
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

app.get('/api/imgs', imgModel.getImgs);

router.get('/partials/*', function(req, res){
    res.render(__dirname + '/public/app/' + req.params[0]);
});

router.get('/img/thumb/*', function(req, res){
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

router.get('/img/*', function(req, res){
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