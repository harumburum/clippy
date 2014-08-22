var url         = require('url');
var http        = require('http');
var SERVICE_URL  = "http://kyliavlob.com/api/images";

exports.getThumbBuffer = function(fileStream, side, format, callback){
    var thumbApiUrl = url.parse(SERVICE_URL + "?side=" + side + "&format=" + format);
    var requestOptions = {
        method: "POST",
        protocol: thumbApiUrl.protocol,
        port: thumbApiUrl.port,
        hostname: thumbApiUrl.hostname,
        path: thumbApiUrl.path,
        headers: {
            'Accepts': 'application/json',
            'Content-Length': fileStream.length
        }
    };

    var responseBuffer = null;
    var request = http.request(requestOptions);
    request.on('response', function(response) {
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
                callback.call(null, responseBuffer);
            }
        });
    });
    request.end(fileStream);
};
