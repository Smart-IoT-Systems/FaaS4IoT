# Standardized proxy example

In this example we are sending CSV data from an Arduino Uno to the Edge via Serial protocol, convert the data to NGSI-based data and then sending in to the MQTT broker.
The infrastructure is as following:
- IoT device : Arduino Uno
- Edge device : Raspberry pi
- Broker : MQTT

### Get started
First, you can upload our example of Arduino [code](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/examples/standardized/arduino_csv_data.ino) to your Arduino device using the Arduino IDE or you can use your own piece of code but with the condition of using CSV format for data.

CSV (comma separated values) is a simple format in which each field is separated by a comma. In the standardized proxy you should follow the following format for data:

- DeviceID, TypeOfDevice, TypeOfData, ValueOfData


Second, install the proxy using docker by executing the build script 
  
    ./build
Then Run the docker container and specify the port you will use and give it permission (e.g., serial port=/dev/ttyACM0).
  
    docker run --device=/dev/ttyACM0:rw -it standardized-example-proxy

