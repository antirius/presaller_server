const path = require('path');
const fs = require('fs');

module.exports = function (app, current_route) {

    current_route = current_route + '/api';

    app.route(current_route).get(function (req, res, next) {
        res.end('API, require version');
    });

    var _filename = "index.js";
    var files = fs.readdirSync(__dirname);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(__dirname, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            require('./' + files[i] + '/' + _filename)(app, current_route);
        }
    }
};