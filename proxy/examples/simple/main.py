import serial_comm
import mqtt_transfer


#Change these variables according to your environment
host_name = "192.168.43.247"
broker_port = 1883
port_serial = "/dev/ttyACM0"
baudrate = 9600
topic="serial/sub/arduino"

client=mqtt_transfer.configConnection(host_name,broker_port)
while True:
	#get serial data
	serial_comm.serialcommunication(port_serial,baudrate)
	serial_data = serial_comm.serialcommunication(port_serial,baudrate)
	#send the data to Cloud broker
	mqtt_transfer.publish(client,topic,serial_data)
