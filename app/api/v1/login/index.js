const async = require('async');
const auth = require('../auth.js');

module.exports = function (app, current_route) {

    current_route = current_route + '/login';

    app.route(current_route).get(function (req, res, next) {

        const device_id = (req.query.device_id || '').trim().toLowerCase();

        if (!device_id) {
            res.json({
                code: 400,
                message: 'Empty Device ID',
            });
            return;
        }

        async.waterfall([
            function (callback) {
                auth(device_id, function (err, result) {
                    if (err) {
                        res.status(result.code).json(result);
                    } else {
                        callback(null);
                    }
                });
            },
            function (callback) {
                console.log("Авторизация устройства: " + device_id);
                res.json({
                    code: 0,
                    message: 'OK',
                });
            },
        ], function done(err, result) {

        });

    });

}