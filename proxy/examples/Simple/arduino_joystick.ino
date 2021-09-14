#include <ArduinoJson.h>

void setup() {
  // Initialize Serial port
  Serial.begin(9600);
  // while (!Serial) continue;
}

void loop() {
  int state;
  String jsondata;
  
  const int capacity = JSON_ARRAY_SIZE(2) +  3 * JSON_OBJECT_SIZE(2);
  StaticJsonDocument<1024> doc;
  JsonArray contextElement = doc.createNestedArray("contextElements");
  JsonObject ctx = contextElement.createNestedObject();
  int joystick = analogRead(3);
  if (joystick < 250) {
    state = 1;
    ctx["entityId"] = "Device.01";
    ctx["type"] = "ArduinoUno";
    ctx["attributes"][0]["name"] = "joystick";
    ctx["attributes"][0]["type"] = "int";
    ctx["attributes"][0]["value"] = state;

    jsondata = serializeJson(doc, Serial);
    Serial.println(jsondata);


  }
  else {
    state = 0;
    ctx["entityId"] = "Device.01";
    ctx["type"] = "ArduinoUno";
    ctx["attributes"][0]["name"] = "joystick";
    ctx["attributes"][0]["type"] = "int";
    ctx["attributes"][0]["value"] = state;

   jsondata =  serializeJson(doc, Serial);
   Serial.println(jsondata);

  }
  delay(500);
}
