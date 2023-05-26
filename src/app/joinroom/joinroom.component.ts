import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';

@Component({
  selector: 'app-joinroom',
  templateUrl: './joinroom.component.html',
  styleUrls: ['./joinroom.component.scss']
})
export class JoinroomComponent implements OnInit {
  // roomExist:any

constructor(public model: ModelLocater, private formBuilder: FormBuilder, public SocketSvc: SocketconnectionServices) { }
  
 ngOnInit(): void {
    
 }
 getRoomCode(event:any) {
  this.model.roomCode = event.target.value;
}

}
