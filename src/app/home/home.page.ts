import { AfterViewInit, Component, OnInit  } from '@angular/core';
import {SArduinoService} from '../services/s-arduino.service'
import { Observable } from 'rxjs';
import { Stats } from '../interfaces/Stats';
import { AlertController } from '@ionic/angular';
import { AppData } from '../AppData';
import { interval } from 'rxjs';





const source$ =interval(3000);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit  {
  status : AppData;
  server='192.168.1.17'
  debugFlag:boolean = false;
  _statusSystem : boolean;
  toogleButton: any;
  tipoRiego: string;
  temperaturaStart:number;
  temperaturaEnd:number;
  now: Date;
  nowHour: number;
  nowMins: number;
  timeStart:string;
  timeEnd: string;
  humedadMinima:number;
  humedadMaxima:number;
  automatic:boolean;

  constructor(private serviceArduino: SArduinoService, private alertController : AlertController) {}
 

  ngOnInit(): void {
    this.status=null;
    this.tipoRiego='terrestre';
    this.presentAlert();
    this.timeStart='';
    this.timeEnd='';
    this.temperaturaStart=0;
    this.temperaturaEnd=0;
    
  } 

  ngAfterViewInit(){
    this.toogleButton= document.getElementById("tooglePump");
    console.log(this.toogleButton);

  }


  debugStatus(opt: number){
    this.requestData('0');

    
  }

  
  offTipoRiego(){
    this.status.data.aereo=0;
    this.status.data.terrestre=0;
  }


  checkTipoRiego(){
    console.log(this.tipoRiego);
    this.offTipoRiego();
    if(this.tipoRiego=='terrestre'){
      console.log('Ejecuta terrestre');
      this.status.data.terrestre=1;
    }
    if(this.tipoRiego=='aereo'){
      this.status.data.aereo=1;
      console.log('Ejecuta aereo');
    }
    if(this.tipoRiego=='ambos'){
      console.log('Ejecuta Ambos');
      this.status.data.aereo=1;
      this.status.data.terrestre=1;
    }
  }


  powerOffSystem(){
    this.status.data.pump=0;
    this.status.data.fan1=0;
    this.status.data.fan2=0;
    this.status.data.aereo=0;
    this.status.data.terrestre=0;
  }
  startFans(){
    this.status.data.fan1=1;
    this.status.data.fan2=1;
  }

  stopFans(){
    this.status.data.fan1=0;
    this.status.data.fan2=0;
  }

  enableAutomatic(){
    this.automatic = true;
  }
  disableAutomatic(){
    this.automatic = false;
  }


  requestData(opt : string ){
    
      this.serviceArduino.getStatus(this.server, '0').subscribe((data)=>{
        if( this.status.data.pump != data.pump ||
            this.status.data.fan1 != data.fan1 ||
            this.status.data.fan2 != data.fan2 ||
            this.status.data.aereo != data.aereo ||
            this.status.data.terrestre != data.terrestre ||
            this.status.data.temperatura != data.temperatura ||
            this.status.data.caudal  != data.caudal ||
            this.status.data.volume != data.volume ||
            this.status.data.humedad1 != data.humedad1 ||
            this.status.data.humedad1 != data.humedad2
          )
          {
            console.log('cambio detectado')

              this.serviceArduino.getStatus(this.server, opt).toPromise();
              console.log('cambio ejecutado')
             console.log('----------------');
          }
      });
      
    
   
  }

  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración del Servidor',
      buttons: [ {text:'Cancel'},{text: 'OK',   handler: data  => {
        if(data[0]!=''){
          this.server= data[0]; 
        }
          
        this.serviceArduino.getStatus(this.server, '0').subscribe((_data)=>{this.status = new AppData(_data);
          source$.subscribe(
            (x) => { 
              //Server
              if(this.server!=''){this.serviceArduino.getStatus(this.server,'0').subscribe((__data)=>{
        //Humedad
                if((__data.humedad1 <= this.humedadMinima || __data.humedad2 <= this.humedadMinima  )&& this.automatic){
                  this.status.data.pump=1;
                  this.checkTipoRiego;
                  console.log('Encendido automático por umbral de humedad')
                }
                if((__data.humedad1 >= this.humedadMaxima || __data.humedad2 >= this.humedadMaxima  )&& this.automatic){
                  this.status.data.pump=0;
                  this.status.data.aereo=0;
                  this.status.data.terrestre=0;
                  console.log('Apagado automático por umbral de humedad');
                }
                //Tiempo
                if(this.timeStart != ''){
                  this.now= new Date();
                  this.nowHour = this.now.getHours();
                  this.nowMins = this.now.getMinutes();
                  if(this.nowHour== Number(this.timeStart.substring(0, this.timeStart.indexOf(':'))) &&
                  this.nowMins == Number(this.timeStart.substring(this.timeStart.indexOf(':')+1, this.timeStart.length))){
                    this.status.data.pump=1;
                    this.checkTipoRiego();
                    console.log('Encendido automatico por umbral de tiempo');
                  }}
                  
                  if(this.timeEnd != ''){
                    this.now= new Date();
                    this.nowHour = this.now.getHours();
                    this.nowMins = this.now.getMinutes();
                    if(this.nowHour== Number(this.timeEnd.substring(0, this.timeEnd.indexOf(':'))) &&
                    this.nowMins == Number(this.timeEnd.substring(this.timeEnd.indexOf(':')+1, this.timeEnd.length))){
                      this.status.data.pump=0;
                      this.offTipoRiego();
                      console.log('Apagado automatico por umbral de tiempo');
                    }}
                  //Temperatura
                  console.log(this.temperaturaStart, __data.temperatura, this.temperaturaEnd);
                  if((__data.temperatura >=  this.temperaturaStart &&  __data.temperatura <= this.temperaturaEnd )&& this.automatic){
                    this.startFans();
                    console.log('Start Fans')
                  }else if(this.automatic){
                    this.stopFans();
                  }
                  
                  if(__data.pump ==1){
                    this._statusSystem = true;
                    this.checkTipoRiego();
                  }else{
                    this._statusSystem = false;
                  }


              if( this.status.data.pump != __data.pump ||
                this.status.data.fan1 != __data.fan1 ||
                this.status.data.fan2 != __data.fan2 ||
                this.status.data.humedad1 != __data.humedad1 ||
                this.status.data.humedad2 != __data.humedad2 ||
                this.status.data.aereo != __data.aereo ||
                this.status.data.terrestre != __data.terrestre ||
                this.status.data.temperatura != __data.temperatura ||
                this.status.data.caudal != __data.caudal ||
                this.status.data.volume != __data.volume
              ) {console.log('cambio detectado server-side');  /*this.updateStatusSensors();*/
                  console.log(__data);
              setTimeout(
                (function(scope){
                    return function(){
                      scope.serviceArduino.getStatus(scope.server,'0').subscribe((__data)=>{
                        if( scope.status.data.pump != __data.pump ||
                          scope.status.data.fan1 != __data.fan1 ||
                          scope.status.data.fan2 != __data.fan2 ||
                          scope.status.data.humedad1 != __data.humedad1 ||
                          scope.status.data.humedad2 != __data.humedad2 ||
                          scope.status.data.aereo != __data.aereo  ||
                          scope.status.data.terrestre != __data.terrestre ||
                          scope.status.data.temperatura != __data.temperatura ||
                          scope.status.data.caudal != __data.caudal ||
                          scope.status.data.volume != __data.volume
                        ){scope.status.data= __data;
                          // scope.updateStatusSensors();  
                          // console.log(scope.status.data); 
                          // console.log('cambio ejecutado server-side');
                        }
                      });
              console.log('----------------');
             
            };
     

            })(this), 1000
            );
            }
              })}}
          );});
       }}],
      inputs: [
        {
          placeholder: this.server
        }
      ]
    });
  await alert.present();
  }

  async presentAlertTipoRiego() {
    const alert = await this.alertController.create({
      header: 'Seleccione Tipo Riego',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          console.log("Riego:" +data);
          this.tipoRiego=data;
          this.checkTipoRiego();
        },
      },],
      inputs: [
        {
          label: 'Riego Aereo',
          type: 'radio',
          value: 'aereo',
        },
        {
          label: 'Riego Subterráneo',
          type: 'radio',
          value: 'terrestre',
        },
        {
          label: 'Ambos',
          type: 'radio',
          value: 'ambos',
        },
      ],
    });
    await alert.present();
  }


  async presentAlertTemperature() {
    const alert = await this.alertController.create({
      header: 'Seleccione Temperatura Limite',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          console.log("Temperatura:" ,data[0], data[1]);
          if(data[0] !='' && data[1]!=''){
            this.temperaturaStart= Number(data[0]);
            this.temperaturaEnd= Number(data[1]);
          }
        },
      },],
      inputs: [
        {
          placeholder: 'Minima',
          type: 'number',
        },
        {placeholder: 'Máxima',
          type: 'number',
        },
      ],
    });
    await alert.present();
  }


 async presentAlertHumidity(){
  const alert = await this.alertController.create({
    header: 'Humedad minima y máxima',
    buttons: [
      {
        text: 'OK',
        handler: (data) => {
        this.humedadMinima= data[0];
        this.humedadMaxima= data[1];
        console.log("Humedad Min/Max:", this.humedadMinima, this.humedadMaxima);
        },
      },
    ],
    inputs: [
      {
        placeholder: 'Minima',
        type: 'number',
      },
      {placeholder: 'Máxima',
        type: 'number',
      },
    ],
  });

  await alert.present();

  }

  async presentAlertTime() {
    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.timeStart= String(data[0]);
            this.timeEnd= String(data[1]);
          },
        },
      ],
      inputs: [
        {
          type: 'time',
        },
        {
          type: 'time',
        },
      ],
    });

    await alert.present();
  }
}
