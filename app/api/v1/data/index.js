const path = require('path');
const fs = require('fs');
const async = require('async');

var _auth = '../auth.js';

const auth = require(_auth);

const data_all = 'Data'

module.exports = function(app, current_route) {

  current_route = current_route + '/data/:id';

  app.route(current_route).get(function(req, res, next) {

    const data_type = (req.params.id || '').toLowerCase() + '.txt';
    const device_id = (req.query.device_id || '').trim().toLowerCase();

    if (!device_id) {
      res.status(400).json({
        code: 400,
        message: 'Empty Device ID',
      });
      return;
    }

    async.waterfall([
      function(callback) {
        auth(device_id, function(err, result) {
          if (err){
            res.status(result.code).json(result);
          }else{
            callback(null);
          }
        });
      },
      function(callback) {
        const data_device = path.join(global.main_dir, '..', 'data', 'Data', device_id, data_type);
        fs.exists(data_device, function(exists) {
          if (exists) {
            res.sendFile(data_device);
            callback(new Error('OK'));
          } else {
            callback(null);
          }
        });
      },
      function(callback) {
        const data_all = path.join(global.main_dir, '..', 'data', 'Data', 'ALL', data_type);
        fs.exists(data_all, function(exists) {
          if (exists) {
            res.sendFile(data_all);
            callback(new Error('OK'));
          } else {
            callback(null);
          }
        });
      },
      function(callback) {
        res.status(400).json({
          code: 400,
          message: 'Data not found',
        });
        callback(null);
      }
    ], function done(err, result) {

    });

  });

}
