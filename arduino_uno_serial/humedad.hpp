const int pHumiditySensor= A0; 
const int pHumiditySensor2=A1; 

int sHumiditySensor;
int sHumiditySensor2;

void updateHumedad(){
  sHumiditySensor = analogRead(pHumiditySensor)/1023;
  sHumiditySensor2 =analogRead(pHumiditySensor2)/1023; 
  Serial.print("h:");
  Serial.print(sHumiditySensor);
  Serial.println();
  Serial.print("H:");
  Serial.print(sHumiditySensor2);
  Serial.println();
}
