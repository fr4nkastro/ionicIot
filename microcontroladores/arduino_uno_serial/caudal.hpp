volatile int NumPulsos; //variable para la cantidad de pulsos recibidos
int PinSensor = 2;    //Sensor conectado en el pin 2
float factor_conversion=7.11; //para convertir de frecuencia a caudal
float volumen=0;
long dt=0; //variación de tiempo por cada bucle
long t0=0; //millis() del bucle anterior

//---Función que se ejecuta en interrupción---------------
void ContarPulsos ()  
{ 
  NumPulsos++;  //incrementamos la variable de pulsos
} 

//---Función para obtener frecuencia de los pulsos--------
int ObtenerFrecuecia() 
{
  int frecuencia;
  NumPulsos = 0;   //Ponemos a 0 el número de pulsos
  interrupts();    //Habilitamos las interrupciones
  delay(1000);   //muestra de 1 segundo
  noInterrupts(); //Deshabilitamos  las interrupciones
  frecuencia=NumPulsos; //Hz(pulsos por segundo)
  return frecuencia;
}

void updateCaudalVolumen(){
  
  if (Serial.available()) {
    if(Serial.read()=='r')volumen=0;//restablecemos el volumen si recibimos 'r'
  }
  float frecuencia=ObtenerFrecuecia(); //obtenemos la frecuencia de los pulsos en Hz
  float caudal_L_m=frecuencia/factor_conversion; //calculamos el caudal en L/m
  dt=millis()-t0; //calculamos la variación de tiempo
  t0=millis();
  volumen=volumen+(caudal_L_m/60)*(dt/1000); // volumen(L)=caudal(L/s)*tiempo(s)

   //-----Enviamos por el puerto serie---------------
  Serial.print ("C:"); 
  Serial.print (caudal_L_m,3); 
  Serial.println();

  Serial.print ("V:");
  Serial.print (volumen,3); 
  Serial.println();

}
