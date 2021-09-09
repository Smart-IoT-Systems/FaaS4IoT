import serial_comm
import CSV_to_NGSI
import mqtt_transfer

#Change these variables according to your environment
host_name = "192.168.43.247"
broker_port = 1883
port_serial = "/dev/ttyACM0"
baudrate = 9600
topic="serial/temp"

client=data_transfer.configConnection(host_name,broker_port)
while True:
	communication_device.serialcommunication(port_serial,baudrate)
	serial_data = communication_device.serialcommunication(port_serial,baudrate)

	formatted_data = data_structure.format_dataCSV_toNGSI(serial_data)

	data_transfer.publish(client,topic,formatted_data)
