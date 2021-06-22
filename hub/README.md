# FaaS4IoT Hub

## What is it?
This is the hub meant to be deployed on edge devices. 
The hub provide a MQTT interface for the functions to interact (i) locally and (ii) with the orion context broker.
Several functions can register to the hub. The hub handles and manage the communication and subscriptions to the Orion broker.

The MQTT broker within the hub can be used for local communications between functions, devices, etc.

<img src="../deployer/doc/images/hub.png" width="50%" height="50%">

## On the relationship between functions and the hub
The interface for the functions is the following:

`/fcid/in` 
> -> message that trigger the functions. Messages can be any context information the function subscribed to. Messages are coming from Orion and are thus in the ngsiv2 format.

`/fcid/out` 
> -> the channel for functions to publish messages. Messages published need to be in the ngsiv2 format.

To trigger a function, one may send, using an HTTP POST request, a message similar to the following:
```
{
    "id":"fc1",
    "triggers": ["/plop2/fillingLevel"]
}
```

The field trigger is in this format: `/<ngsiv2_entity>/<attrs>`. Attributes are not mandatory.

The enpoint for the request should be the following: `http://<ip_gateway>:1212/admin

## How to get started
1. Build the project using:
```console
$ npm install
```
2. Deploy using:
```console
$ docker-compose up -d
```
3. The broker is accessible at `mqtt://<ip>`
4. The hub can be configured at `http://<ip>:1212/admin`


