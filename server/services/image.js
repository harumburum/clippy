var url         = require('url');
var http        = require('http');
//var SERVICE_URL  = "http://kyliavlob.com/api/images";
var SERVICE_URL  = "http://localhost:54363/images";

exports.getThumbBuffer = function(buffer, side, format, callback){
    var thumbApiUrl = url.parse(SERVICE_URL + "?side=" + side + "&format=" + format);
    var requestOptions = {
        method: "POST",
        protocol: thumbApiUrl.protocol,
        port: thumbApiUrl.port,
        hostname: thumbApiUrl.hostname,
        path: thumbApiUrl.path,
        headers: {
            'Accepts': 'application/json',
            'Content-Length': buffer.length
        }
    };

    var responseBuffer = null;
    var responseError = false;
    var request = http.request(requestOptions);
    request.on('error', function(err){
       console.log('Images api service error. ' + err);
       responseError = true;
       callback.call(null, err, responseError);
    });
    request.on('response', function(response) {
        if(response.statusCode !== 200){
            console.log('Api returned: ' + response.statusCode);
            responseError = true;
        }
        response.on('data', function(chunk) {
            if (responseBuffer) {
                if (typeof (Buffer.concat) === 'function') {
                    responseBuffer = Buffer.concat([responseBuffer, chunk]);
                } else {
                    var holder = new Buffer(responseBuffer.length + chunk.length);
                    responseBuffer.copy(holder);
                    chunk.copy(holder, responseBuffer.length);
                    responseBuffer = holder;
                }
            } else {
                responseBuffer = chunk;
            }
        });
        response.on('end', function() {
            if (typeof callback === 'function') {
                callback.call(null, responseBuffer, responseError);
            }
        });
    });
    request.end(buffer);
};
