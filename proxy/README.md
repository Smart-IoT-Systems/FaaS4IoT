# Content
-[Design system](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy#design-system)

-[Proxy](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy#proxy)

-[Proxy structure](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy#proxy-structure)

-[Proxy policies](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy#proxy-policies)

-[Get Started](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy#get-started)

# Design system
Currently, FaaS4IoT platform supports the Cloud-Edge space only. It has not extended its features yet to support the IoT space. 
The platform offers developers the ability to create functions on the GUI and IDE of FaaS4IoT. Once functions are created, it will be registered on the Orion broker of the Cloud. Second, the deployment of functions will be set on gateway with docker containers sent through the bridge to broker installed in the gateway thanks to the GeneSIS component. Third, functions on the gateway can publish and subscribe via the MQTT broker. The information on the MQTT broker will also be sent to the Orion broker to the Cloud.  Finally, not developers can orchestrate data, but also, can consult the functions and entities registered on the Cloud broker via the FaaS4IoT GUI.
Currently, FaaS4IoT platform supports the Cloud-Edge space only. It has not extended its features yet to support the IoT space. 


![image](https://user-images.githubusercontent.com/47181226/133777251-cf1a183a-f101-4ebe-957e-083044baf832.png)


## Proxy
In order to extend FaaS4IoT to IoT space, we need a component that will ensure the communication with the IoT devices, for that, we thought about adding a software component named Proxy.
Proxy is a software component that have the responsibility of linking the Edge and IoT spaces together and managing the data structure to send it to the broker in Cloud.
A proxy component is responsible for the communication with IoT devices. Before getting to detail the structure of this component we need to present the requirements that led to its design.
The requirements identified are:
- Communication with IoT devices: IoT devices are present in an heterogenous environment running on different protocols. We need to make it possible for the Proxy to communicate with these devices with different communication protocols especially the ones that does not support Internet connection such as Serial or Bluetooth.
- Communication with the broker on Cloud: In order to communicate with the Cloud broker, we need to satisfy two needs. First, we need to convert the data received to standardized data accepted by the broker. Second, we need to transfer the converted data to the Cloud broker.
- Flexibility: Developers may need to write their own logic in the proxy to satisfy their needs. For that reason, we need a flexible and easy to use component.


![image](https://user-images.githubusercontent.com/47181226/133210155-e70d877c-3a94-4f43-9084-f4f5ec7bf355.png)
So the system design components are as following:
-	FaaS4IoT GUI and IDE: is an interface allowing developers to develop their own functions desired to be deployed on the Edge and IoT devices. 
-	FaaS4IoT: is responsible for deploying functions on GeneSIS component and giving it the order to deploy these functions on the Edge. 
-	Broker: currently the broker installed on the FaaS4IoT system is Orion broker, which allows to manage the entire lifecycle of context information including updates, queries, registrations, and subscriptions. 
-	GeneSIS: is responsible for deploying functions on the Edge by getting the order from the FaaS4IoT component on the Cloud. 
-	Bridge to broker: connects the broker installed on the Edge to the broker on the Cloud. 
-	MQTT broker: responsible for receiving all the data and events to send to all the subscribed clients. 
-	Proxy: is the link between Edge and IoT devices. 



## Proxy structure
The main components that form a Proxy are:
- Communication: is a library who ensures communication with the IoT devices based on different protocols (e.g., we need to get temperature value from a sensor connected to an Arduino Uno which uses the Serial protocol for communication, for that, the user can leverage the library for Serial communication from the Proxy’s communication library to  communicate between IoT device and Edge).
- User Code: developers can create their own logic in the proxy for data processing (e.g., we need to transform and aggregate data published in CSV format by two devices into a new data structure. The developer can create its mapping and aggregation of data within the Proxy before sending it to Cloud broker).
- Data Structure: is a library responsible for converting the data to standard data to communicate with the Cloud (e.g., currently FaaS4IoT Cloud broker is Orion, in order to  communicate with it we need NGSI-based data. For that, users who do not use NGSI-based data can leverage the library of data structure to represent their data and send it to Cloud broker).
- Data Transfer: is a library responsible for sending the data to the Cloud (e.g., an event occurred within the temperature sensor, the value exceeded the limits and the state of the device has changed. We need to send this information to the Cloud, so users can leverage aData Transfer library to satisfy this need)
 ![image](https://user-images.githubusercontent.com/47181226/133210017-e5925563-66b1-4c4e-aa14-8eab1570bcd1.png)
Overall, the following process is applied. First, devices send or receive data via the Communication library using the desired protocol. Second, the data will be processed in the User Code section where developers customize their data processing as desired. Third, users can exploit the Data Structure library to transform it into a standardized data and then process it. Finally, the data will be sent to the platform. In the context of FaaS4IoT it is sent to a MQTT broker where finally it will get to a broker on the Cloud.
You can find the available libraries [here](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy/libraries)
 
## Proxy policies 
Proxy is a generic FaaS4IoT component, easy to use but also, it allows the developer to customize it as desired.  
Proxy offers different policies for configuration:  
  -	Standardized Proxy: used when we are receiving data from devices that are not standardized as NGSI-based data (i.e., We are using standardized NGSI data on FaaS4IoT system as we are working with Orion broker). 
  -	Simple Proxy: used when we are receiving NGSI-based data from devices. 
  -	Registered Proxy: used when the device and its entities are registered on the Orion broker at Cloud. 
  -	Unregistered Proxy: used when the device and its entities are not registered on the Orion broker at Cloud. 
  
We are offerning some examples using different policies of proxy [here](https://github.com/Smart-IoT-Systems/FaaS4IoT/tree/main/proxy/examples)

# Get Started
- Upload the FaaS4IoT project using git clone to your Desktop	
    
		git clone https://github.com/Smart-IoT-Systems/FaaS4IoT.git

- Use the template and change the variables in the script [main.py](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/template/main.py) according to your environment. You can find more details [here](https://github.com/Smart-IoT-Systems/FaaS4IoT/blob/main/proxy/template).
- Enter to the directory of FaaS4IoT project and get to the proxy's directory then run the build scprit
    
		cd ~/Desktop/FaaS4IoT/proxy
		./build.sh
		
- Run the docker container 
    
		docker run proxy-faas4iot
- If you are using serial IoT device, you should give the docker container access to the serial port (for example serial port is: /dev/ttyACM0) as following:
    
		docker run --device=/dev/ttyACM0:rw -it proxy-faas4iot



