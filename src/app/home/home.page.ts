import { AfterViewInit, Component, OnInit  } from '@angular/core';
import {SArduinoService} from '../services/s-arduino.service'
import { Observable } from 'rxjs';
import { Stats } from '../interfaces/Stats';
import { AlertController } from '@ionic/angular';
import { AppData } from '../AppData';
import { interval } from 'rxjs';



const source$ =interval(1000);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit  {
  status : AppData;
  server='192.168.43.63'
  debugFlag:boolean = false;
  _statusSystem : boolean;
  toogleButton: any;

  constructor(private serviceArduino: SArduinoService, private alertController : AlertController) {}
 

  ngOnInit(): void {
<<<<<<< HEAD
    this._statusData= new Stats;
    this.requestData('');

=======
    this.status=null;
    this.presentAlert();
>>>>>>> version2-alpha

   
   
    
  } 

  ngAfterViewInit(){
    this.toogleButton= document.getElementById("tooglePump");
    console.log(this.toogleButton);

  }


  debugStatus(opt: number){
<<<<<<< HEAD
    if(opt==1){
      this._statusData.pump=1;
      this._statusData.ph=1;
      this.updateStatusSensors();
    }
    else{
      this._statusData.pump=0;
      this._statusData.ph=0;
      this.updateStatusSensors();
    }
=======
    this.requestData('0');

>>>>>>> version2-alpha
    
  }

  powerOffSystem(){
<<<<<<< HEAD
      if(this._statusData.pump!=0)
        this.requestData('pump');

=======
    this.status.data.pump=0;
    this.status.data.fan1=0;
    this.status.data.fan2=0;
>>>>>>> version2-alpha
  }


  requestData(opt : string ){
    
      this.serviceArduino.getStatus(this.server, '0').subscribe((data)=>{
        if( this.status.data.pump != data.pump ||
            this.status.data.fan1 != data.fan1 ||
            this.status.data.fan2 != data.fan2
          )
          {
            console.log('cambio detectado')

              this.serviceArduino.getStatus(this.server, opt).toPromise();
              console.log('cambio ejecutado')
             console.log('----------------');
          }
      });
      
    
   
  }

<<<<<<< HEAD
  updateStatusSensors(){
    if(this._statusData.ph ==1){
      this._statusSystem=true;
    }
    else{
      this._statusSystem= false;
    }
  }
=======
  // updateStatusSensors(debugFlag){
  //   if(debugFlag){
  //     //Verificar estado de sensor 1
  //     if(this.status.data.sensor1==1 && this.status.data.fan1==0){
  //       //Encender fan1
  //       this.requestData('2');
  //     }
  //     //Verificar estado de sensor 2
  //     if(this.status.data.sensor2==1 && this.status.data.fan2==0){
  //       //Encender fan2
  //       this.requestData('3');
  //     }

      
  //       setTimeout(
  //         (function(scope){
  //             return function(){
  //               if(scope.status.data.pump==1)
  //                 this.requestData('1');                
  //       console.log('\n Bomba apagada----------------');};
  //         })(this), 3000
  //     );        
  

  //     if(this.status.data.sensor2==1){
  //       this.requestData('3');
        
  //     }
  //   }



  //   if(this.status.data.sensor1 ==1 && this.status.data.sensor2==1){
  //     this._statusSystem=true;

  //   }
  //   else{
  //     this._statusSystem= false;

  //   }
  // }

>>>>>>> version2-alpha

  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración del Servidor',
      buttons: [ {text:'Cancel'},{text: 'OK',   handler: data  => {
        if(data[0]!=''){
          this.server= data[0]; 
        }
          
        this.serviceArduino.getStatus(this.server, '0').subscribe((_data)=>{this.status = new AppData(_data);
          source$.subscribe(
            (x) => { if(this.server!=''){this.serviceArduino.getStatus(this.server,'0').subscribe((__data)=>{
              if( this.status.data.pump != __data.pump ||
                this.status.data.fan1 != __data.fan1 ||
                this.status.data.fan2 != __data.fan2 ||
                this.status.data.sensor1 != __data.sensor1 ||
                this.status.data.sensor2 != __data.sensor2 
              ) {console.log('cambio detectado server-side');  /*this.updateStatusSensors();*/
              setTimeout(
                (function(scope){
                    return function(){
                      scope.serviceArduino.getStatus(scope.server,'0').subscribe((__data)=>{
                        if( scope.status.data.pump != __data.pump ||
                          scope.status.data.fan1 != __data.fan1 ||
                          scope.status.data.fan2 != __data.fan2 ||
                          scope.status.data.sensor1 != __data.sensor1 ||
                          scope.status.data.sensor2 != __data.sensor2 
                        ){scope.status.data= __data;
                          // scope.updateStatusSensors();  
                          console.log(scope.status.data); 
                          console.log('cambio ejecutado server-side');}
                      });
                      
                      
              console.log('----------------');};
                })(this), 1000
            );
                // setTimeout(function(){console.log(this.status.data) }, 1000);

            }

              
              })}}
          );});

        
       }}],
      inputs: [
        {
          placeholder: '192.168.43.63'
        }
      ]
    });

    await alert.present();
  }

}
