
const logger = require('../logger.js');
const fetch = require('node-fetch');
var Docker = require('dockerode');

const GeneSIS_Connector = function (endpoint) {
    var that = {};
    that.endpoint = endpoint;
    that.deployment_model = {};

    that.loadFromGeneSIS = function () {
        fetch(that.endpoint + "/genesis/model_ui")
            .then(response => response.json())
            .then(data => {
                that.deployment_model = data.dm;
            });
    };

    that.loadFromGeneSISWithoutUI = async function () {
        return await fetch(that.endpoint + "/genesis/model")
            .then(response => response.json())
            .then(data => {
                that.deployment_model = data;
                return data;
            });
    };

    that.cleanDeployment = function () {
        fetch(that.endpoint + '/genesis/deploy', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'clean'
            })
        }).then(response => response.json())
            .then(response => {
                if (response.started) {
                    logger.log('info', 'Deployment cleaned!');
                }
            });

    };

    that.deploy = async function (model) {
        return await fetch(that.endpoint + '/genesis/deploy', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(model)
        }).then(response => response.json())
            .then(response => {
                console.log("GeneSIS deployment status: " + JSON.stringify(response));
            });
    };

    that.pushModel = function (model) {
        fetch(that.endpoint + '/genesis/push_model', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        }).then(response => response.json())
            .then(response => {
                console.log(JSON.stringify(response));
            });
    };

    that.executeCommand = async function (dockerHost, containerID, commandSpecs = {}) {
        const DEFAULT_SPECS = {
            Cmd: ["/bin/sh", "-c", "ls  -l"],
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
        };

        commandSpecs = Object.assign({}, DEFAULT_SPECS, commandSpecs);
        await that.resetDockerHost(dockerHost);
        const container = that.docker.getContainer(containerID);
        const execution = await container.exec(commandSpecs);

        const stream = await execution.start();

        stream.pipe(process.stdout, { end: true });
        await that.endOf(stream);
    };

    that.uploadArchive = async function (dockerHost, containerID, archive, path) {
        try {
            await that.resetDockerHost(dockerHost);
            const container = that.docker.getContainer(containerID);
            const response = await container.putArchive(archive, { path: path });
            logger.info(`File '${archive}' uploaded on container '${containerID}' : '${JSON.stringify(response)}'`);

        } catch (error) {
            logger.log('error', `Cannot upload '${archive}' on container '${containerID}' with error '${JSON.stringify(error)}' `);
        }
    };

    that.resetDockerHost = async function (host) {
        that.docker = new Docker({
            host: host.ip,
            port: host.port
        });
        await that.docker.ping();
    };

    that.endOf = function (stream) {
        return new Promise((resolve, reject) => {
            stream.on('error', () => reject());
            stream.on('close', () => resolve());
            stream.on('end', () => resolve());
            stream.on('finish', () => resolve());
        });
    }

    return that;
};

module.exports = GeneSIS_Connector;