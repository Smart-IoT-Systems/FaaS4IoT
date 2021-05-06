const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const logger = require('./src/logger.js');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('./swagger/swagger.json');

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

app.get('/test', (req, res) => {
    console.log("plop");
    res.end();
})

app.post('/test', (req, res) => {
    console.log("plop: " + JSON.stringify(req.body));
    res.end();
})

// Send the server logs
app.get("/logs", getLogs);

function getLogs(req, res) {
    var contents = fs.readFileSync(__dirname + '/faas4iot.log', 'utf8');
    res.end(contents);
}