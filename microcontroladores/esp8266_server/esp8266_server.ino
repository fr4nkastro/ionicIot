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
  digitalWrite(pAereo, sAereo);
  digitalWrite(pSubterraneo, sSubterraneo);
  
}



void setup(void) 
{
  sPump=1;
  sFan1=1;
  sFan2=1;
  sRelay=1;
  sHumiditySensor=0;
  sHumiditySensor2=0;
  sAereo=1;
  sSubterraneo=1;

 
  sPushEmergency=0;
  Serial.begin(velocidadBaudios);
  
  pinMode(pPump, OUTPUT);
  pinMode(pFan1, OUTPUT);
  pinMode(pFan2, OUTPUT);
  pinMode(pRelay, OUTPUT);
  pinMode(pPushEmergency, INPUT);
  pinMode(pAereo, OUTPUT);
  pinMode(pSubterraneo, OUTPUT);
  Serial.print('r');

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
  int indexTerminator;
  String value ;
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
    indexTerminator = serialInput.indexOf(":");
      if(indexTerminator != -1){
        //Extraer comando
        currentCommand= serialInput.substring(0,indexTerminator);
        value=serialInput.substring(indexTerminator+ 1,serialInput.length()-1);
        Serial.println("Command: " +currentCommand);   
        Serial.println("Value: "+value);
      }

     //Reset for the next message
     message_pos = 0;
   }
  

    switch (currentCommand[0]) {
    case 'h':
      sHumiditySensor= value.toInt();
    break;
    case 'H':
      sHumiditySensor2 = value.toInt();
      break;
    case 'V':
      sVolume= value.toInt();
    break;
    case 'C':
      sCaudalSensor = value.toFloat();
    break;
    case 'T':
      sTemperature = value.toFloat();
    break;
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
