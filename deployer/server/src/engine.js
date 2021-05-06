var NGSI = require('ngsijs');

var connection = new NGSI.Connection("http://127.0.0.1:1026");
connection.v2.listEntities().then((response) => {
    response.results.forEach((entity) => {
        console.log(entity.id + " " + JSON.stringify(entity.fillingLevel));
    });
});

var ctxObj = {
    "id": "plop2",
    "type": "plo",
    "fillingLevel": {
        "type": "Property",
        "value": 0.85
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

/*connection.v2.createEntity(ctxObj).then((response) => {
    console.log("WWW>" + JSON.stringify(response));
}).catch((error) => {
    console.log(JSON.stringify(error));
});*/

connection.v2.updateEntityAttributes({
    "id": "plop2",
    "fillingLevel": {
        "value": 12
    }
}).then((response) => {
    console.log("WWW>" + JSON.stringify(response));
}).catch((error) => {
    console.log(JSON.stringify(error));
});

connection.v2.listSubscriptions().then((response) => {
    console.log("IIII>" + JSON.stringify(response.results));
}).catch((error) => {
    console.log(JSON.stringify(error));
});

var subscription = {
    "description": "One subscription to rule them all",
    "subject": {
        "entities": [
            {
                "id": "plop2",
                "type": "plo"
            }
        ]
    },
    "notification": {
        "http": {
            "url": "http://192.168.1.41:8080/test"
        },
        "attrs": [
            "fillingLevel"
        ]
    },
    "throttling": 5
};

/*connection.v2.createSubscription(subscription).then((response) => {
    console.log("SSSSSS>" + JSON.stringify(response.results));
}).catch((error) => {
    console.log(JSON.stringify(error));
});*/

/*/connection.v2.deleteSubscription("60915064428a5f08f9b92df2").then((response) => {
    console.log("SSSSSS>" + JSON.stringify(response.results));
}).catch((error) => {
    console.log(JSON.stringify(error));
});*/
