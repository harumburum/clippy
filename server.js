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
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/img2cloud');
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
router.post('/api/img', function(req, res, next) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    }).on('end', function(){
        data = data.replace(/^data:image\/png;base64,/, "");
        fs.writeFile("out.png", data, 'base64', function(err) {
            console.log(err);
        });
        res.send(200);
    });
});



router.get('/partials/*', function(req, res){
    res.render(__dirname + '/public/app/' + req.params[0]);
});
router.get('*', function(req, res){
    res.render('index', { });
});
app.use('/', router);





//Run node
var port = 3030;
app.listen(port);
console.log('Magic happens on port ' + port + '...');