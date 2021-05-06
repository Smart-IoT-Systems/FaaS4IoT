const NGSI = require('ngsijs');
const mqtt = require('mqtt');
const logger = require('./logger.js');


const ip_bridge = process.env.IP_BRIDGE || "http://192.168.1.41:1212";

class NGSIBridge {

    constructor(urlOrion, app, contexts, fcId) {
        this.allContexts = contexts;
        this.urlOrion = urlOrion;
        this.fcId = fcId;
        this.allSubscriptionIds = [];
        this.connection = new NGSI.Connection(urlOrion);
        this.clientMQTT = mqtt.connect('mqtt://mosquitto');
        this.clientMQTT.on('connect', function () {
            logger.log('info', 'Connected to local broker');
        });
        this.express = app;
    }

    publishData() {
        let tpc = '/' + this.fcId + '/out';
        this.clientMQTT.subscribe(tpc);
        this.clientMQTT.on('message', (topic, message) => {
            let mesg = message.toString();
            if (topic === tpc && mesg !== "") {
                let update = JSON.parse(mesg);
                this.updateEntityAttributes(update);
            }
        });
    }

    async subscribeAllContexts() {
        for (const element of this.allContexts) {
            let r = await this.addSubscription(element);
            this.allSubscriptionIds.push(r.subscription.id);
        }
    }

    async unsubscribeAllContexts() {
        for (const element of this.allSubscriptionIds) {
            console.log('Removing: ' + element);
            await this.deleteSubscription(element);
        }
    }

    /***
    NGSI Utilities 
    ****/

    async listEntities() {
        let response = await this.connection.v2.listEntities();
        return response.results;
    };

    async listSubscriptions() {
        try {
            let response = await this.connection.v2.listSubscriptions();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteSubscription(subscription) {
        try {
            let response = await this.connection.v2.deleteSubscription(subscription);
            return response.results;
        } catch (error) {
            throw error;
        }
    }

    async createSubscription(subscription) {
        try {
            let response = await this.connection.v2.createSubscription(subscription);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateEntityAttributes(attribute) {
        try {
            let response = await this.connection.v2.updateEntityAttributes(attribute);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createEntity(entity) {
        try {
            let response = await this.connection.v2.createEntity(entity);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addSubscription(topic) {
        let endpoint = ip_bridge + "/" + this.fcId;

        this.express.post('/' + this.fcId, (req, res) => {
            console.log("plop: " + JSON.stringify(req.body.data));
            this.clientMQTT.publish("/" + this.fcId + '/in', JSON.stringify(req.body.data));
            res.end();
        })

        let sbscr = this.processTopic(topic);

        var subscription = {
            "description": "Subscription for " + this.fcId,
            "subject": {
                "entities": [
                    {
                        "id": sbscr.id
                    }
                ]
            },
            "notification": {
                "http": {
                    "url": endpoint
                },
                "attrs": sbscr.attrs
            },
            "throttling": 5
        };

        let result = await this.createSubscription(subscription);
        return result;
    }

    processTopic(topic) {
        let result = {};
        let tmp = topic.split('/');
        if (tmp.length > 1) {
            result.id = tmp[1];
            if (tmp.length > 2) {
                result.attrs = [];
                for (let i = 2; i < tmp.length; i++) {
                    result.attrs.push(tmp[i]);
                }
            }
        }
        return result;
    }

};

module.exports = NGSIBridge

