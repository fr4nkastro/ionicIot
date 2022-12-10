const int pHumiditySensor= A0; 
const int pHumiditySensor2=A1; 

int sHumiditySensor;
int sHumiditySensor2;


void updateHumedad(){
  sHumiditySensor = analogRead(pHumiditySensor);
  sHumiditySensor2 =analogRead(pHumiditySensor2); 
  Serial.print("h:");
  Serial.print(100- (100.0* sHumiditySensor/1023.0));
  Serial.println();
  Serial.print("H:");
  Serial.print(100- (100.0* sHumiditySensor/1023.0));
  Serial.println();
}
