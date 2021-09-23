# Simple proxy example

This is an example of how to use a simple configuration of Proxy where we are sending NGSI data (i.e., the state of the joystick) from an Arduino Uno to the Edge  via the Serial protocol and then sending it over to the broker .

The infrastructure used in this example is as following: 
- IoT device : Arduino Uno with an TFT shield with joystick

![image](https://user-images.githubusercontent.com/47181226/134436124-395e29a7-dd3a-4503-a9ec-1a9c372b6c6a.png){:height="50%" width="50%"}

- Edge device : Raspberry pi 3 with Raspbian OS

![image](https://user-images.githubusercontent.com/47181226/134436426-b6a3a015-7f1b-4ac9-baf3-ca26b4faebca.png =250x250)

- Broker: MQTT (mosquitto)
### Get started
First, you can upload our example of Arduino [code](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/examples/Simple/arduino_joystick.ino) to your Arduino device with TFT shield with joystick using the Arduino IDE or you can use your own piece of code and device with condition of using NGSI data.
Second, install the proxy using docker. Run the build script 
  
    ./build
Then Run the docker container.
  
    docker run --device=/dev/ttyACM0:rw -it simple-example-proxy
