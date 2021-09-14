# Simple proxy example

This is an example of how to use a simple configuration of Proxy where we are sending NGSI data (i.e., the state of the joystick) from an Arduino Uno to the Edge  via the Serial protocol and then sending it over to the broker on Cloud.

The infrastructure of this example is as following: 
- IoT device : Arduino Uno with an TFT shield with joystick
- Edge device : Raspberry pi 3
- Cloud broker: Orion
