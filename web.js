var express = require('express');
var fs=require('fs');
var buf=require('buffer');
var path=require('path');

var app = express();
app.use(express.logger());
app.use(express.static(path.join(__dirname, 'bootstrap'));
app.get('/', function(request, response) {
    response.send(fs.readFileSync('index.html').toString());
    });
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
    });
