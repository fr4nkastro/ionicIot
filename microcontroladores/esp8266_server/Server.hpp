ESP8266WebServer server(80);
#include "pags.hpp"


void control() {
  String statusJsonResponse;
  String optArg = server.arg(String("opt"));


  if (optArg.length() > 0) {
    // ?opt=1 -> Activa la bomba de agua
    switch (optArg.toInt()) {
      case allStatus:
        break;
      case pump:
        sPump = !sPump;
        digitalWrite(pPump, sPump);

        break;
      case fan1:
        sFan1 = !sFan1;
        digitalWrite(pFan1, sFan1);
        break;
      case fan2:
        sFan2 = !sFan2;
        digitalWrite(pFan2, sFan2);
        break;

      case subterraneo:
        sSubterraneo = !sSubterraneo;
        digitalWrite(pSubterraneo, sSubterraneo);
        break;

      case aereo:
        sAereo = !sAereo;
        digitalWrite(pAereo, sAereo);
        break;

      case ambos:
        //verificar estado de electrovalvulas y encender ambas
        if (sAereo == sSubterraneo){
          sAereo = !sAereo;
          sSubterraneo = !sSubterraneo;
        }else {
          sAereo =sSubterraneo;
        }
        
        break;
    }
  }


  statusJsonResponse = statusJson();
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", statusJsonResponse);
}



void InitServer() {
  server.on("/", control);
  server.on("/action", control);


  // Iniciar servidor
  server.begin();
  Serial.println("Servidor Iniciado");
}
