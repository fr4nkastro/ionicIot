import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stats } from '../interfaces/Stats';

@Injectable({
  providedIn: 'root'
})
export class SArduinoService {


  constructor(private http: HttpClient) { 
    
  }

  public getStatus(server: string, opt : string =""){
    let url = "http://"+server+'/'+opt;
    return this.http.get<Stats>(url);
  }

}
