# FaaS4IoT

## What is it?

The FaaS4IoT deployer is the engine responsible for deploying your function in production. This includes:
1. Building your function
2. Deploying your function
3. Registering and configuring your function

---

## Getting started

FaaS4IoT requires the following components to be executed:
> 1. Docker
> 2. Docker compose (optional)
> 3. Node.js (Latest LTS Version, recommended)
> 4. NPM (Latest LTS Version, recommended)

In addition, at least: 
* One host (e.g., a gateway or a VM) should be available for deployment before you try to deploy a function. This host should run the FaaS4IoT hub. Details on how to install the FaaS4IoT hub can be found [here](../hub).
* One instance of the Orion Context broker should be running and available remotely.

### How to start FaaS4IoT

#### Start FaaS4IoT using Docker-compose (easiest)
1. In the FaaS4IoT/deployer folder, build the project by running the following command:
```console
npm install
```
2. Still in the FaaS4IoT/deployer folder, start FaaS4IoT and the Orion broker using the following command:
```console
docker-compose up
```

#### Start FaaS4IoT using Docker

FaaS4IoT is available, pre-packaged with all its dependencies, as a Docker image. Provided you have Docker up and running, you can proceed as follows:
1. Install FIWARE Orion and MongoDB (documentation available here) with the ports 1026 (Orion) and 27017 (Mongo) open.
2. On the machine that will run FaaS4IoT, export an environment variable named ORION whose value is the IP address of your Orion broker.
```console
export urlORION=http://192.168.1.2
```
3. In the FaaS4IoT/deployer folder, build the project by running the following command:
```console
npm install
```
4. Still in the FaaS4IoT/deployer folder, build your image of FaaS4IoT by running the following command:
```console
docker build . -t <your_name>:deployer
```
5. At this stage, you can run the FaaS4IoT deployer using the following command:
```console
docker run -p 8080 <your_name>:deployer
```

### Process to use Faas4IoT

Starting from scratch, the normal process for using FaaS4IoT is composed of the following steps:
1. Start the FaaS4IoT deployer and the Orion Context Broker (cf. sections above).
2. Start the FaaS4IoT on at least one of your function hosting device. The hub will automatically register de device in the Orion Broker (see more details [here](../hub)).
3. Write your function. Typically a set of source files together with libraries.
4. Use the web interface or the REST API of the FaaS4IoT deployer to deploy your function. You need to provide: (i) the source of your function (directly a folder on the machine running FaaS4IoT or an archive), (ii) the event used by your function, (iii) an id for your function, (iv) the runtime required by your function. The deployer will automatically deploy the runtime on the target device, create a docker image for the function, and deploy it on top of the runtime. More details in the next section.


### How to use FaaS4IoT



---

## A small example

---

## API description
