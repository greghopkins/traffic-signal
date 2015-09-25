var b = require('bonescript');
var express = require('express');
var bodyParser = require('body-parser');

var _colorToPin = {
    'red': 'P8_25',
    'yellow': 'P8_24',
    'green': 'P8_5'
};

var _set = function(colorStates) {
    for (var color in colorStates) {
        b.digitalWrite(_colorToPin[color], colorStates[color] ? b.HIGH : b.LOW);
    }
};

var _get = function () {
    var colorStates = {};
    for (var color in _colorToPin) {
        colorStates[color] = !!b.digitalRead(_colorToPin[color]);
    }
    return colorStates;
};

var _startup = function () {
    _set({red: true, yellow: true, green: true});
    setTimeout(function () {
        _set({red: false, yellow: false, green: false});
    }, 1000);
};

for (var color in _colorToPin) {
    b.pinMode(_colorToPin[color], b.OUTPUT);
}

_startup();

var app = express();
app.use(bodyParser.json());

app.put('/signal', function(req, res) {
    console.log('setting signal to: ' + JSON.stringify(req.body));
    _set(req.body);
    res.status(200).json(_get());
});

var server = app.listen(3001, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Signal app listening at http://%s:%s', host, port);
});
