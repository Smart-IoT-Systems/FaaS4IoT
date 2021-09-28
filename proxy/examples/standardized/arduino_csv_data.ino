// declare three Strings:
// this is dummy code we are not using any sensors here

String stringOne, stringTwo, stringThree;

void setup() {
  Serial.begin(9600);
  stringTwo = String("Temperature,");
  stringOne = String("Device.01,ArduinoUno,");
  stringThree = String();
}

void loop() {
int i =5;
while(true){
  stringThree =  stringOne + stringTwo + i;
  Serial.println(stringThree); 
  delay(1000);
}
  
//  while (true);
}
