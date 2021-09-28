# Simple proxy example

This is an example of how to use a simple configuration of Proxy where we are sending NGSI data (i.e., the state of the joystick: 0=not pressed, 1=pressed) from an Arduino Uno to the Edge  via the Serial protocol and then sending it over to the broker .

The infrastructure used in this example is as following: 
- IoT device : Arduino Uno with an TFT shield with joystick


<img src=https://user-images.githubusercontent.com/47181226/134436124-395e29a7-dd3a-4503-a9ec-1a9c372b6c6a.png width=200 length=200>

- Edge device : Raspberry pi 3 with Raspbian OS

<img src=https://user-images.githubusercontent.com/47181226/134436426-b6a3a015-7f1b-4ac9-baf3-ca26b4faebca.png width=200 length=200>

- Broker: MQTT (mosquitto)

### Get started
First, you can upload our example of Arduino [code](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/examples/simple/arduino_joystick.ino) to your Arduino device with TFT shield with joystick using the Arduino IDE or you can use your own piece of code and device and device with condition of using NGSI data.
Second, install the proxy using docker by executing the build script 
  
    ./build
    
Then Run the docker container and specify the port you will use and give it permission (e.g., serial port=/dev/ttyACM0).
  
    docker run --device=/dev/ttyACM0:rw -it simple-example-proxy
