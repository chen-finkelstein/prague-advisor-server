var express = require('express');
var app = express();
var cors = require('cors');
const jwt = require("jsonwebtoken");
const user = require("./user_module");
const poi = require("./poi_module");
var path = require('path');

var rootPath = path.normalize(__dirname) + '/../';
app.use(express.static(rootPath + '/app'));
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/assets/images'));

// run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(cors());
app.use(express.json());

secret = "chenSecret";

app.use('/', function (req, res, next) {
    // check for token in header or in body
    const token = req.headers['x-auth-token'];
    if (token) {            
        jwt.verify(token, secret, function (err, decoded) {
            if (!err) {
                var decoded = jwt.decode(token, {complete: true});
                req.decoded = decoded;
            }
        });
    }
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve('app/index.html'));
});

app.use('/user',user);

app.use('/poi',poi);

