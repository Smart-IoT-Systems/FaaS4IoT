const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const logger = require('./src/logger.js');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('./swagger/swagger.json');
var deployer = require('./src/engine.js');

const port = process.env.PORT || 8080;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    app.use(middleware.swaggerUi());
    app.listen(port, '0.0.0.0', function () {
        logger.log('info', 'Engine API started on ' + port);
    });
});

logger.log('info', 'Engine started!');

/**
 * Example:
 * {
 *  "id":"fc1",
 *  "triggers": ["/plop2/fillingLevel"],
 *  "runtime": "path_to_model_model.json",
 *  "src": "path_to_src"
 * }
 * to test: {
 *   "id": "fc1",
 *   "ctx": [
 *       "/plop2/fillingLevel"
 *   ],
 *   "runtime": "/deployer/doc/examples/simple-runtime.json",
 *   "src": "/deployer/doc/examples/simple-function.js"
 *}
 */
app.post("/deploy", async (req, res) => {
    logger.log('info', "Function registered " + req.body);
    let fc = req.body;
    let engine = deployer();
    engine.deploy(fc, "tmp1");
    res.end();
});

// Send the server logs
app.get("/logs", getLogs);

function getLogs(req, res) {
    var contents = fs.readFileSync(__dirname + '/faas4iot.log', 'utf8');
    res.end(contents);
}