# Template for proxy component

This template allows you to use the proxy as desired.
In order to use the: libraries provided by FaaS4IoT use import as following
```python
import serial_comm
import CSV_to_NGSI
import mqtt_transfer
```
- serial_comm : library to read data from serial devices
- CSV_to_NGSI : library to transform CSV data to standardized NGSI data in order to communicate it with orion broker in Cloud
- mqtt_transfer : library to pulish data on MQTT broker

Before using the template you should also change some variables first.
In the main.py file you should change:
  - host_name : The address of your mqtt broker host.
  - broker_port : The port of your mqtt broker (Default : 1883).
  - baudrate : If you are using a Serial Device you should set the value according to the baudrate of your serial device.
  - topic : Set your Mqtt topic in which you would like to publish the data
 You will find the variables on the [main.py script](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/template/main.py) as following:
```python
host_name = "192.168.43.77"
broker_port = 1883
port_serial = "/dev/ttyACM0"
baudrate = 9600
topic="serial/temp
```
In order to read the serial data from the device use the following function:
```python
serial_comm.serialcommunication(port_serial,baudrate)
```
If you are using CSV data and you want to convert in to NGSI data, use the following function:
```python
CSV_to_NGSI.format_dataCSV_toNGSI(serial_data)
```
To send data over MQTT broker, use the following function:
```python
mqtt_transfer.publish(client,topic,data)
```
