import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  constructor() { }

  checkNetworkConnection(){
    if( navigator.onLine){
      console.log('Device is online..')
     alert('Device is online..')
    }
    else{
      console.log('Device is offline..')
     alert('Device is offline..')

    }
  }

}
