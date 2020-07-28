const path = require('path');
const fs = require('fs');

module.exports = function (app, current_route) {

    var current_route2 = current_route + '/v2';
    app.route(current_route2).get(function (req, res, next) {
        res.end('api v2');
    });

    current_route = current_route + '/v1';


    app.route(current_route).get(function (req, res, next) {
        res.end('api v1');
    });


    var _filename = "index.js";
    var files = fs.readdirSync(__dirname);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(__dirname, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            require('./' + files[i] + '/' + _filename)(app, current_route);
            require('./' + files[i] + '/' + _filename)(app, current_route2);
        }
    }

};