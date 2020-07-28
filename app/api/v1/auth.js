module.exports = function (device_id, callback) {
    //авторизация
    if (global.config.demo_mode) {
        callback(null);
    } else {
        if (!global.config.devices || global.config.devices.indexOf(device_id) === -1) {
            console.log('Устроство не зарегистрировано: ' + device_id);
            console.log('Если это новое устройство, то просто добавьте id "' + device_id + '" в файл "config.json" в массив "devices"');

            callback(new Error(), {
                code: 401,
                message: 'Устройство не зарегистрировано',
            });
        } else {
            callback(null);
        }
    }
}