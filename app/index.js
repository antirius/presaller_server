const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

global.config = require('./config.json');
global.main_dir = __dirname;

const app = express();

app.set('trust proxy', global.config.server.trust_proxy);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});

var current_route = global.config.server.point;

app.use(cookieParser()); //req.cookies //https://www.npmjs.com/package/cookie-parser
app.use(bodyParser.json()); //req.body //https://www.npmjs.com/package/body-parser

require('./api/index.js')(app, current_route);

function afterConnect() {
    var port = global.config.server.port || 3000;
    var server = app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });

    process.on('SIGINT', function () {
        server.close(function () {
            console.log("Закрываем соединения...");
            // Close db connections, etc.
        });

        setTimeout(function () {
            console.error("Закрываем приложение принудительно по таймауту...");
            process.exit(0);
        }, 30 * 1000);
    });
}

afterConnect();