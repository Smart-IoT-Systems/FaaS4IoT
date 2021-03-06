var mm = require('./metamodel');
var GeneSIS_Connector = require('./connectors/genesis-connector');
var fs = require('fs');
const NGSI = require('ngsijs');
const logger = require('./logger.js');
var Docker = require('dockerode');
var DockerodeCompose = require('dockerode-compose');
var temp = require("temp");
var tar = require("tar");
const fetch = require('node-fetch');
var mm_genesis = require('./metamodel-genesis');

var urlGeneSIS = process.env.GENESIS || "http://192.168.1.40";
var urlOrion = process.env.ORION || "http://192.168.1.43";

var engine = function () {
    var that = {};
    that.FunctionRegistry = mm.FunctionRegistry({});
    that.FunctionResourceRegistry = mm.FunctionResourceRegistry({});
    that.RuntimeRegistry = mm.RuntimeRegistry({});


    /**
     * Used to deploy a function
     * @param {*} func The function to be deployed. Should be a JSON object
     */
    that.deploy = async function (func, hub) {
        let idGateway = hub.id;
        let ip_gateway = hub.ip_address.value.split(":1026")[0];
        urlGeneSIS = ip_gateway;

        // We register the function in the registry
        let f = mm.Function(func);
        that.FunctionRegistry.functions.push(f);

        // We deploy GeneSIS on the selected gateway if needed
        await that.deployGenesis(idGateway);

        // We prepare the software stack
        await that.deploySoftwareStack(f);

        // We add the function
        let src = "";
        let archivePath = ""
        console.log(JSON.stringify(f.functionResource));
        if (fs.existsSync(f.functionResource)) {
            archivePath = f.functionResource;
            logger.log('info', 'Found function source');
        } else {
            let tempName = await temp.path();
            fs.writeFileSync(tempName, f.functionResource);
            src = tempName;
            archivePath = await that.archiveFunction(src);
        }


        // Need to retrieve the id of the newly created container
        let conn_genesis = GeneSIS_Connector(urlGeneSIS + ":8000"); //IP should come from the repository
        let rawm = await conn_genesis.loadFromGeneSISWithoutUI();
        let dm = mm_genesis.deployment_model({});

        // Build the deployment model from the JSON fragments from the
        // HTTP POST requests.
        dm.name = rawm.name;
        dm.revive_components(rawm.components);
        dm.revive_links(rawm.links);
        dm.revive_containments(rawm.containments);

        let container_id;
        let docker_ip;
        let docker_port;
        let func_command;
        for (let comp of dm.components) {
            if (comp.function_holder != undefined && comp.function_holder) {
                console.log("here is the place holder!");
                let host = dm.find_host_one_level_down(comp);
                for (let compo of rawm.components) {
                    console.log(JSON.stringify(compo));
                    console.log(JSON.stringify(host));
                    if (compo.name === host.name) {
                        console.log(compo.container_id);
                        container_id = compo.container_id;
                    }
                }

                func_command = host.properties[0].function_command;
                let infra_host = dm.find_host(comp);
                docker_ip = infra_host.ip;
                docker_port = infra_host.port[0];
            }
        }

        console.log(container_id + " " + docker_ip + " " + docker_port);

        if (container_id !== undefined && docker_ip !== undefined && docker_port !== undefined) {
            //We upload the archive in the container
            logger.log('info', "trying to upload: " + archivePath + " on: " + container_id);
            await conn_genesis.uploadArchive({ ip: docker_ip, port: docker_port }, container_id, archivePath, "/");

            //Register the function in the hub
            await that.registerInHub(func);

            // We start it
            let path_without_extension = f.functionResource.split('.')[0];
            let path_function = path_without_extension.split('/')[2];
            conn_genesis.executeCommand({ ip: docker_ip, port: docker_port }, container_id, {
                Cmd: [func_command, path_function + "/main.js"],
                AttachStdout: true,
                AttachStderr: true,
                Tty: true
            });
            logger.log("info", "Function is deployed and started! Good job :)");
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
        console.log(urlGeneSIS);
        let conn_genesis = GeneSIS_Connector(urlGeneSIS + ":8000");
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
                        host: urlGeneSIS,
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


    that.archiveFunction = async function (src, options = {}) {
        const OPTION_DEFAULTS = {
            scriptName: "function",
            archiveName: "function.tar.gz",
            prefix: "faas4IoT"
        };
        options = Object.assign({}, OPTION_DEFAULTS, options);

        try {
            const path = await temp.mkdir(options.prefix);

            // Dump the healthcheck code into a file
            //const script = path + "/" + options.scriptName;
            //fs.writeFileSync(script, func);

            // Create a tarball including the script file
            const archivePath = `${path}/${options.archiveName}`;
            await tar.c({
                gzip: true,
                file: archivePath,
                cwd: path
            },
                [src]);

            logger.log('info', `Archive ready at '${path}/${options.archiveName}'`);
            return archivePath;

        } catch (error) {
            logger.log("error", "Unable to write the function on disk! " + error);
        }
    };

    that.registerInHub = async function (func) {
        var content = {
            "id": func.id,
            "triggers": func.triggers
        };

        return await fetch(urlGeneSIS + ':1212/admin', { //URL to be fixed, this should be dynamic
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(content)
        }).then(response => response.json())
            .then(response => {
                console.log("Hub registration status: " + JSON.stringify(response));
            });
    };

    that.getFunctionResources = async function (req, res) {
        res.end(JSON.stringify(that.FunctionResourceRegistry));
    };

    that.addFunctionResources = async function (req, res) {
        let input = JSON.parse(req.body.metadata);
        logger.log("info", "Received new runtime: " + input.id);
        input.path = req.files[0].path;
        console.log(JSON.stringify(req.files));
        if (input.id !== "" && input.id !== undefined) {
            that.FunctionResourceRegistry.FunctionResources.push(input);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end();
        }
    };

    that.removeFunctionResource = async function (req, res) {
        let input = req.body;
        let r = that.FunctionResourceRegistry.removeFunctionResource(input.id);
        logger.log("info", "Runtime to be removed: " + input.id + " " + r);
        if (r) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end();
        }
    }

    that.getRuntimes = async function (req, res) {
        res.end(JSON.stringify(that.RuntimeRegistry));
    };

    that.addRuntimes = async function (req, res) {
        let input = req.body;
        logger.log("info", "Received new runtime: " + input.id);
        if (input.id !== "" && input.id !== undefined) {
            that.RuntimeRegistry.runtimes.push(input);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end();
        }
    };

    that.removeRuntime = async function (req, res) {
        let input = req.body;
        let r = that.RuntimeRegistry.removeRuntimes(input.id);
        logger.log("info", "Runtime to be removed: " + input.id + " " + r);
        if (r) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end();
        }
    }

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

