const mqtt = require('mqtt');

var clientMQTT = mqtt.connect('mqtt://127.0.0.1');
clientMQTT.on('connect', function () {
    console.log('Function connected');
    clientMQTT.subscribe(tpc + "/in");
});

var tpc = "/fc1";

clientMQTT.on('message', (topic, message) => {
    let mesg = message.toString();
    if (topic === tpc + "/in" && mesg !== "") { //Main function code from here
        let j = {
            "id": "plop2",
            "fillingLevel": {
                "value": 2222
            }
        };
        clientMQTT.publish(tpc + "/out", JSON.stringify(j));
    }
});