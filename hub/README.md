# FaaS4IoT Hub

This is the hub meant to be deployed on edge devices. 
The hub provide a MQTT interface for the functions to interact (i) locally and (ii) with the orion context broker.

The interface for the functions is the following:

/fcid/in -> message that trigger the functions. Messages can be any context information the function subscribed to. Messages are coming from Orion and are thus in the ngsiv2 format.

/fcid/out -> the channel for functions to publish messages. Messages published need to be in the ngsiv2 format.

Here is how a to register a function:
{
"id":"fc1",
"triggers": ["/plop2/fillingLevel"]
}

The field trigger is in this format: /<ngsiv2_entity>/<attrs>. Attributes are not mandatory.

Several functions can register to the hub. The hub handles and manage the communication and subscriptions to the Orion broker.

The MQTT broker within the hub can be used for local communications between functions, devices, etc.



