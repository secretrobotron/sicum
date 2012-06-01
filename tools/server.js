var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    app = express.createServer();

var wwwRoot = path.resolve(__dirname + '/../'),
    assetsRoot = wwwRoot + '/assets',
    levelsRoot = assetsRoot + '/levels';

app.use(express.static(wwwRoot))
   .use(express.directory(wwwRoot, { icons: true }));

app.get('/list-levels', function(req, res) {
  fs.readdir(levelsRoot, function(err, files){
    res.contentType('text/json');
    res.send(JSON.stringify(files));
  });
});

app.listen(8888, '127.0.0.1', function() {
  var addy = app.address();
  console.log('Server started on http://localhost:8888');
  console.log('Press Ctrl+C to stop');
});