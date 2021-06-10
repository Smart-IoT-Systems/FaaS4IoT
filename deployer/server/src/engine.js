var mm = require('./metamodel');
var GeneSIS_Connector = require('./connectors/genesis-connector');
var fs = require('fs');
const NGSI = require('ngsijs');
const logger = require('./logger.js');
var Docker = require('dockerode');
var DockerodeCompose = require('dockerode-compose');
var temp = require("temp");
var tar = require("tar");

const urlOrion = process.env.ORION || "http://192.168.1.41";

var engine = function () {
    var that = {};
    that.FunctionRegistry = mm.FunctionRegistry({});


    /**
     * Used to deploy a function
     * @param {*} func The function to be deployed. Should be a JSON object
     */
    that.deploy = async function (func, idGateway) {
        // We register the function in the registry
        that.FunctionRegistry.functions.push(func);

        // We deploy GeneSIS on the selected gateway if needed
        await that.deployGenesis(idGateway);

        // We prepare the software stack
        await that.deploySoftwareStack(func);

        // We add the function
        let src = "";
        if (!fs.existsSync(func.src)) {
            src = func.src;
        } else {
            src = fs.readFileSync(func.src);
        }
        let archivePath = await that.archiveFunction(src);

        // Need to retrieve the id of the newly created container
        let conn_genesis = GeneSIS_Connector(urlOrion + ":8000");
        let dm = await conn_genesis.loadFromGeneSISWithoutUI();
        let container_id;
        let docker_ip;
        let docker_port;
        let func_command;
        for (let comp of dm.components) {
            if (comp.function_host != undefined && comp.function_host) {
                container_id = comp.container_id;
                func_command = comp.properties[0].function_command;
            }
            if (comp._type === "/infra/docker_host") { // This assumes there is only one host in a runtime !
                docker_ip = comp.ip;
                docker_port = comp.port[0];
            }
        }

        if (container_id !== undefined && docker_ip !== undefined && docker_port !== undefined) {
            conn_genesis.uploadArchive({ ip: docker_ip, port: docker_port }, container_id, archivePath, "/");

            // We start it
            conn_genesis.executeCommand({ ip: docker_ip, port: docker_port }, container_id, {
                Cmd: [func_command, "/function"],
                AttachStdout: true,
                AttachStderr: true,
                Tty: true
            });
        } else {
            await conn_genesis.deploy({});
            logger.log("error", "Could not deploy runtime. Thereby, your function has not been deployed.");
        }
    }

    /**
     * Used to terminate a function
     * @param {*} id ID of the function to be removed
     */
    that.removeFunction = function (id) {

    };

    /**
     * Used to deploy a software stack via GeneSIS
     * @param {*} func 
     */
    that.deploySoftwareStack = async function (func) {
        let model = {};
        if (fs.existsSync(func.runtime)) {
            let tmp = fs.readFileSync(func.runtime);
            model = JSON.parse(tmp);
        } else {
            model = func.runtime;
        }
        let conn_genesis = GeneSIS_Connector(urlOrion + ":8000");
        await conn_genesis.deploy(model);
    }

    /**
     * Used to deploy  GeneSIS on a gateway. GeneSIS will be used to deploy the function software stack
     * @param {*} idGateway 
     */
    that.deployGenesis = async function (idGateway) {
        let conn_ngsi = new NGSI.Connection(urlOrion + ":1026");
        conn_ngsi.v2.getEntity(idGateway).then(
            async (response) => {
                let gateway = response.entity;
                if (!gateway.equipped.value) {
                    // Deploy GeneSIS and Hub
                    let conn_docker = new Docker({
                        host: urlOrion,
                        port: process.env.DOCKER_PORT || 2375,
                        protocol: 'http'
                    });
                    let compose = new DockerodeCompose(conn_docker, './docker-compose-hub.yml', 'deployer');
                    await compose.pull();
                    let state = await compose.up();
                    logger.log("info", "Gateway equipped: " + state);

                    // Change status
                    conn_ngsi.v2.updateEntityAttributes({
                        "id": "sensor",
                        "equipped": {
                            "value": true
                        }
                    }).then(
                        (response) => {
                            logger.log('info', "Gateway status changed to equipped")
                        }, (error) => {
                            logger.log('error', error);
                        }
                    );
                }
            }, (error) => {
                logger.log('error', error);
            });
    }


    that.archiveFunction = async function (func, options = {}) {
        const OPTION_DEFAULTS = {
            scriptName: "function",
            archiveName: "function.tar.gz",
            prefix: "faas4IoT"
        };
        options = Object.assign({}, OPTION_DEFAULTS, options);

        try {
            const path = await temp.mkdir(options.prefix);

            // Dump the healthcheck code into a file
            const script = path + "/" + options.scriptName;
            fs.writeFileSync(script, func);

            // Create a tarball including the script file
            const archivePath = `${path}/${options.archiveName}`;
            await tar.c({
                gzip: true,
                file: archivePath,
                cwd: path
            },
                [options.scriptName]);

            logger.log('info', `Archive ready at '${path}/${options.archiveName}'`);
            return archivePath;

        } catch (error) {
            logger.log("error", "Unable to write the function on disk! " + error);
        }
    };

    return that;
};

module.exports = engine;



/*var NGSI = require('ngsijs');

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

/*connection.v2.updateEntityAttributes({
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

