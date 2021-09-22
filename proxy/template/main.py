import serial_comm
import CSV_to_NGSI
import mqtt_transfer

#Change these variables according to your environment
host_name = "192.168.43.77"
broker_port = 1883
port_serial = "/dev/ttyACM0"
baudrate = 9600
topic="serial/temp"

client=mqtt_transfer.configConnection(host_name,broker_port)
while True:
	serial_comm.serialcommunication(port_serial,baudrate)
	serial_data = serial_comm.serialcommunication(port_serial,baudrate)

	formatted_data = CSV_to_NGSI.format_dataCSV_toNGSI(serial_data)

	mqtt_transfer.publish(client,topic,formatted_data)
