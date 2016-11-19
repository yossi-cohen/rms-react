var express = require('express');
var app = express();

var cors = require('cors')
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var videos = require('./db');

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Listening on port', port);
})

app.get('/', function (req, res) {
    res.send('ok.');
})

app.get('/api/videos', function (req, res) {
    res.json(videos.getVideoList)
})

app.post("/api/search", function (req, res) {
    //lilox:TODO
    res.json(videos.searchResult);
});

