import serial


def serialcommunication(port_serial,baudrate):
	data=""
	ser = serial.Serial(port_serial, baudrate, timeout=1)
	ser.flush()
	while True:
		if ser.in_waiting > 0:
			data = ser.readline().decode('utf-8').rstrip()
			#print(data)
			return data
