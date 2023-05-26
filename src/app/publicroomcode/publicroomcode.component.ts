import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-publicroomcode',
  templateUrl: './publicroomcode.component.html',
  styleUrls: ['./publicroomcode.component.scss']
})
export class PublicroomcodeComponent implements OnInit {
 

  constructor(public modal: ModelLocater,public sound:SoundService) { }

  ngOnInit(): void {
  }

  getRoomName(event:any){
    this.modal.roomTitle =event.target.value;
    console.log(this.modal.roomTitle)
  }

  selectMode(mode:string){
    this.modal.gameMode = mode;
    console.log('game mode>>', this.modal.gameMode)
  }
  startSound() {
    this.sound.startGameSound('btnSound');
  }

}
