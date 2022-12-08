


String statusJson(){
    String response = 
    String("{")+
        "\"pump\":"+ String(!sPump)+","+
        "\"fan1\":"+ String(!sFan1)+","+
        "\"fan2\":"+ String(!sFan2)+","+
        "\"relay\":"+ String(!sRelay)+","+
        "\"humedad1\":"+ String(sHumiditySensor)+","+
        "\"humedad2\":"+ String(sHumiditySensor2)+","+
        "\"caudal\":"+ String(sCaudalSensor)+","+
        "\"volume\":"+ String(sVolume)+","+
        "\"temperatura\":"+ String(sTemperature)+","+
        "\"aereo\":"+ String(!sAereo)+","+
        "\"terrestre\":"+ String(!sSubterraneo)+        
    "}"
    ;
    

    return response;
  
}
