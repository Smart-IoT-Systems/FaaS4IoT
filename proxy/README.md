# Proxy

Proxy is a software component that have the responsibility of linking the Edge and IoT spaces together and managing the data structure to send it to the broker in Cloud.


![image](https://user-images.githubusercontent.com/47181226/133210155-e70d877c-3a94-4f43-9084-f4f5ec7bf355.png)


## Structure
The structure of Proxy component is as follows: 
  •	Communication: is a library who ensures communication with the IoT devices based on different communication protocols. 
  •	User Code: developers can create their own logic in the proxy for data processing. 
  •	Data Structure: is a library responsible for converting the data to standard data to communicate with the Cloud. 
  •	Data Transfer: is a library responsible for sending the data to the Cloud. 
  
 ![image](https://user-images.githubusercontent.com/47181226/133210017-e5925563-66b1-4c4e-aa14-8eab1570bcd1.png)
 
## Policies 
Proxy is a generic FaaS4IoT component, easy to use but also, it allows the developer to customize it as desired.  
Proxy offers different policies for configuration:  
  •	Standardized Proxy: used when we are receiving data from devices that are not standardized as NGSI-based data (i.e., We are using standardized NGSI data on FaaS4IoT system as we are working with Orion broker). 
  •	Simple Proxy: used when we are receiving NGSI-based data from devices. 
  •	Registered Proxy: used when the device and its entities are registered on the Orion broker at Cloud. 
  •	Unregistered Proxy: used when the device and its entities are not registered on the Orion broker at Cloud. 

