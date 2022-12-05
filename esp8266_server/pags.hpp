


String statusJson(){
    String response = 
    String("{")+
        "\"pump\":"+ String(sPump)+","+
        "\"fan1\":"+ String(sFan1)+","+
        "\"fan2\":"+ String(sFan2)+","+
        "\"relay\":"+ String(sRelay)+","+
        "\"sensor1\":"+ String(sHumiditySensor)+","+
        "\"sensor2\":"+ String(sHumiditySensor2)+
    "}"
    ;
    

    return response;
  
}
