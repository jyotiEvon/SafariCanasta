import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';


@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {
  isVisible:boolean=false;

  // message:string=""
  constructor(public model:ModelLocater,public sound:SoundService) { }

  ngOnInit(): void {
  }

  close(){
   this.model.showErrorMessage = false;
  //  this.model.errorOccured = false;
  // this.model.messagePopupVisible=false;
  }
  startSound() {
    this.sound.startGameSound('btnSound');
  }


}
