
const logger = require('./logger.js');

const GeneSIS_Connector = function (endpoint) {
    var that = {};
    that.endpoint = endpoint;
    that.deployment_model = {};

    that.loadFromGeneSIS = function () {
        fetch("/genesis/model_ui")
            .then(response => response.json())
            .then(data => {
                that.deployment_model = data.dm;
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

    that.deploy = function (model) {
        fetch('/genesis/deploy', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(model)
        }).then(response => response.json())
            .then(response => {
                console.log(JSON.stringify(response));
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
            Cmd: ["/bin/bash", "-c", "ls  -l"],
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
            logger.info(`File '${archive}' uploaded on container '${containerID}'`);

        } catch (error) {
            logger.log('error', `Cannot upload '${archive}' on container '${containerID}':  '${error}' `);
        }
    };

    that.resetDockerHost = async function (host) {
        that.docker = new Docker({
            host: host.ip,
            port: host.port
        });
        await that.docker.ping();
    };

};

module.exports = GeneSIS_Connector;