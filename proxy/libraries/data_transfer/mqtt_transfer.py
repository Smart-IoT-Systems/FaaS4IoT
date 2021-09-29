import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
	print("Connected to mqtt broker with result code"+str(rc))

def publish(client,topic,dataToPublish):
	#client = mqtt.Client()
	client.publish(topic,dataToPublish,0)
	#print("here we are in publish method",dataToPublish)

def configConnection(host_name,broker_port):
	client = mqtt.Client()
	client.on_connect = on_connect
	client.connect(host_name, broker_port,60)
	return client
