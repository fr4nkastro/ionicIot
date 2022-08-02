import { Component, OnInit } from '@angular/core';
import {SArduinoService} from '../services/s-arduino.service'
import { Observable } from 'rxjs';
import { Stats } from '../interfaces/Stats';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  
  server="192.168.2.111"
  statusData : Observable<Stats>;
  _statusData : Stats;
  _statusSystem : boolean;
  
  constructor(private serviceArduino: SArduinoService, private alertController : AlertController) {}
 

  ngOnInit(): void {
    this._statusData= new Stats;
    this.requestData('0');


  } 
  debugStatus(opt: number){
    if(opt==1){
      this._statusData.pump=1;
      this._statusData.sensor1=1;
      this._statusData.sensor2=1;
      this.updateStatusSensors();
    }
    else{
      this._statusData.pump=0;
      this._statusData.sensor1=0;
      this._statusData.sensor2=0;
      this.updateStatusSensors();
    }
    
  }

  powerOffSystem(){
      if(this._statusData.pump!=0)
        this.requestData('1');
      if(this._statusData.fan1!=0)        
      this.requestData('2');
      if(this._statusData.fan2!=0)
        this.requestData('3');

  }


  requestData(opt : string){
    this.statusData= this.serviceArduino.getStatus(this.server,opt );
    this.statusData.forEach(data => {
      this._statusData= data;
      this.updateStatusSensors();
      
     });
 
  }

  updateStatusSensors(){
    if(this._statusData.sensor1 ==1 && this._statusData.sensor2==1){
      this._statusSystem=true;
    }
    else{
      this._statusSystem= false;
    }
  }

  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración del Servidor',
      buttons: [ {text:'Cancel'},{text: 'OK',   handler: data  => {this.server= data[0]}}],
      inputs: [
        {
          placeholder: 'IP Address'
        }
      ]
    });

    await alert.present();
  }

}
