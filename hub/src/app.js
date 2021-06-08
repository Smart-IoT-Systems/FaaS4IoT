const bridge = require('./ngsiv2.js');
const express = require('express');
const logger = require('./logger.js');
const bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

const app = express();
var b;
const urlOrion = process.env.ORION || "http://192.168.1.41:1026";
const name = process.env.GW_NAME || "gateway-" + uuidv4();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
        logger.log('info', "Function registered " + req.body);
        let id = req.body.id;
        let ctx = req.body.triggers;
        b = new bridge(urlOrion, app, ctx, id);
        await b.subscribeAllContexts();
        b.publishData();
        res.end();
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