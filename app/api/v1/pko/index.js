const path = require('path');
const fs = require('fs');
const async = require('async');
const uuidv4 = require('uuid/v4');

const multer = require('multer');
const tmpdir = require('os').tmpdir();
const upload = multer({
    dest: tmpdir
});

const auth = require('../auth.js');

module.exports = function (app, current_route) {

    current_route = current_route + '/pko/';

    app.route(current_route).post(upload.single('file'), function (req, res, next) {

        const device_id = (req.query.device_id || '').trim().toLowerCase();

        if (!device_id) {
            res.status(400).json({
                code: 400,
                message: 'Empty Device ID',
            });
            return;
        }

        if (!req.file) {
            // res.status(400).json({
            //   code: 400,
            //   message: 'File not found',
            // });
            res.json({
                code: 0,
                result: 'OK',
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
                fs.rename(req.file.path, path.resolve(global.main_dir, '..', 'data', 'PKO', uuidv4() + '.xml'), function (err) {
                    if (err) {
                        res.status(500).json({
                            code: 500,
                            result: 'Internal error: ' + err.message,
                        });
                    } else {
                        res.json({
                            code: 0,
                            result: 'OK',
                        });
                    }
                    callback(err);

                });
            }
        ], function done(err, result) {

        });

    });

}