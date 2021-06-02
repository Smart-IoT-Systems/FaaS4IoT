
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
        fetch(that.endpoint + "/genesis/deploy_model")
            .then(response => response.json())
            .then(response => {
                console.log(JSON.stringify(response))
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
};

module.exports = GeneSIS_Connector;