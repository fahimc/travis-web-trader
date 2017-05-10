var express = require('express');
var net = require('net');
var app = express();
var portrange = 45032;
getPort(function(port) {
    app.use(express.static('dist'))
    console.log('SERVER RUNNING ON http://localhost:'+port);
    app.listen(port);
});

function getPort(cb) {
    var port = portrange;
    portrange += 1;

    var server = net.createServer();
    server.listen(port, function(err) {
        server.once('close', function() {
            cb(port);
        })
        server.close()
    });
    server.on('error', function(err) {
        getPort(cb);
    });
}
