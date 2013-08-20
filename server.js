var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express.createServer(express.logger());

app.use(express.static(path.join(__dirname, 'quicksort')));

app.get('/', function(request, response) {
    console.log(__dirname);
    var buf = fs.readFileSync(__dirname + "/quicksort/index.html", 'utf-8', function (err, data) {
        if (err) {
            console.log("Error opening file " + err);
            return;
         }
    });
    response.send(buf.toString('utf-8'));
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
console.log("Listening on " + port);
});