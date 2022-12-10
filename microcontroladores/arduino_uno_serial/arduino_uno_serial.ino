#include "caudal.hpp"
#include "humedad.hpp"
#include "temperatura.hpp"
void setup() 
{ 
  
  Serial.begin(9600); 
  pinMode(PinSensor, INPUT);
  pinMode(A0, INPUT); 
  pinMode(A1, INPUT);

  attachInterrupt(0,ContarPulsos,RISING);//(Interrupción 0(Pin2),función,Flanco de subida)
  Serial.println ("Envie 'r' para restablecer el volumen a 0 Litros"); 
  t0=millis();
  
  //Temperature

  sensorDS18B20.begin();
  // findSensorTemperature();
} 

void loop ()    
{
  updateCaudalVolumen();
  updateHumedad();
  updateTemperature();
}

