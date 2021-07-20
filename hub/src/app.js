const bridge = require('./ngsiv2.js');
const express = require('express');
const logger = require('./logger.js');
const bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var ip = require('ip');

const app = express();
var b;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const urlOrion = process.env.ORION_URL || "http://192.168.1.43"
const urlGateway = process.env.GATEWAY_URL || "http://192.168.1.43"
const name = process.env.GW_NAME || "gateway-" + uuidv4();

checkDocker = () => {
    return new Promise((resolve, reject) => {
        getDockerHost((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

app.listen(1212, '0.0.0.0', async function () {
    logger.log('info', 'Engine API started on 1212');

    /**
     * The gateway register itself in Orion
     */
    var ctxObj = {
        "id": name,
        "type": "gateway",
        "equipped": {
            "value": true
        },
        "ip_address": {
            "value": urlGateway,
        },
        "location": {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": [
                    35.629021,
                    140.156059
                ]
            }
        }
    };
    let b2 = new bridge(urlOrion, app, "", "");
    b2.createEntity(ctxObj).then((response) => {
        logger.log("info", "Gateway register in Orion" + JSON.stringify(response));
    }).catch((error) => {
        logger.log("error", "Could not register gateway in Orion" + JSON.stringify(error));
    });


    /**
     * Example:
     * {
     *  "id":"fc1",
     *  "triggers": ["/plop2/fillingLevel"]
     * }
     */
    app.post("/admin", async (req, res) => {
        logger.log('info', "Function under registration " + req.body);
        let id = req.body.id;
        let ctx = req.body.triggers;
        try {
            b = new bridge(urlOrion, app, ctx, id);
            await b.subscribeAllContexts();
            b.publishData();
            res.end("{}");
        } catch (error) {
            logger.log("error", "could not register function " + JSON.stringify(error));
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end();
        }
    });
});

process.on('SIGINT', async () => {
    try {
        if (b !== undefined) {
            logger.log('info', "Removing subscriptions");
            await b.unsubscribeAllContexts();
        }
        process.exit();
    } catch (error) {
        process.exit();
    }
});