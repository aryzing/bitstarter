var express = require('express');
var fs=require('fs');
var buf=require('buffer');

var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
    response.send(fs.readFileSync('indexhello.html').toString());
    });
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
    });
