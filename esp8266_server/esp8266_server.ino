#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "config.h"  
#include "Server.hpp"
#include "ESP8266_Utils.hpp"

void updateSensor(){
   digitalWrite(pPump, sPump);
  digitalWrite(pBuiltInLed, sBuiltInLed);
  digitalWrite(pFan1, sFan1);
  digitalWrite(pFan2, sFan2);
  digitalWrite(pRelay, sRelay);
  
}

void setup(void) 
{
  sPump=0;
  sFan1=0;
  sFan2=0;
  sRelay=0;
  sHumiditySensor=0;
  sHumiditySensor2=0;
  
  sPushEmergency=0;
  Serial.begin(velocidadBaudios);
  
  pinMode(pPump, OUTPUT);
  pinMode(pFan1, OUTPUT);
  pinMode(pFan2, OUTPUT);
  pinMode(pRelay, OUTPUT);
  pinMode(pPushEmergency, INPUT);


  updateSensor();
 
  ConnectWiFi_STA();
  InitServer();
}
 


 // if(!digitalRead(pPushEmergency)){
 //   Serial.println("Push PRessed");
 //   sPump=0;
 //   sFan1=0;
 //   sFan2=0;
 //   sRelay=0;
 //   sBuiltInLed=0;
 //   updateSensor();
 // }

  


void checkSerialData(){
 while (Serial.available() > 0)
 {
   //Create a place to hold the incoming message
   static char message[MAX_MESSAGE_LENGTH];
   static unsigned int message_pos = 0;

   //Read the next available byte in the serial receive buffer
   char inByte = Serial.read();

   //Message coming in (check not terminating character) and guard for over message size
   if ( inByte != '\n' && (message_pos < MAX_MESSAGE_LENGTH - 1) )
   {
     //Add the incoming byte to our message
     message[message_pos] = inByte;
     message_pos++;
   }
   //Full message received...
   else
   {
     //Add null character to string
     message[message_pos] = '\0';
     serialInput = message;

     //Print the message (or do other things)
    Serial.println("Input: "+serialInput);
    int indexTerminator = serialInput.indexOf(":");
      if(indexTerminator != -1){
        //Extraer comando
        currentCommand= serialInput.substring(0,indexTerminator);
        Serial.println("Command: " +currentCommand);    
      }

     //Reset for the next message
     message_pos = 0;
   }
  

    switch (currentCommand[0]) {
    case 'h':
        Serial.println("Actualizar sensor de humedad 1");
      break;
    case 'H':
      Serial.println("Actualizar sensor de humedad 2");
      break;
    case 'V':
      Serial.println("Actualizar valor de volumen");
    break;
    case 'C':
      Serial.println("Actualizar valor del caudal");
    break;
    //Pendiente ingresar sensor temperatura
    default:

    break;
  }
}
}


void loop()
{
   server.handleClient();
   checkSerialData();
}
