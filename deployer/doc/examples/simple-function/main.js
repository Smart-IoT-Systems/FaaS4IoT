const mqtt = require('mqtt');

var clientMQTT = mqtt.connect('mqtt://host.docker.internal');
clientMQTT.on('connect', function () {
    console.log('Function connected');
    clientMQTT.subscribe(tpc + "/in");
});

var tpc = "/fc1"; // TO BE updated with the proper name of the function

clientMQTT.on('message', (topic, message) => {
    let mesg = message.toString();
    if (topic === tpc + "/in" && mesg !== "") { //Main function code from here
        let j = {
            "id": "plop2",
            "fillingLevel": {
                "value": 2222
            }
        };
        console.log(JSON.stringify(j));
        clientMQTT.publish(tpc + "/out", JSON.stringify(j));
    }
});
