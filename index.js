var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'main.html'));
});
app.get('/game.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'game.html'))
});
app.get('/ui/:filename', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', req.params.filename));
});
var port = 8080;
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});