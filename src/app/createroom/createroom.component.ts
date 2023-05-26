import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';
import { SoundService } from '../services/sound.service';
import { LocalDbService } from '../services/local-db.service';

@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: [
    './createroom.component.scss',
    '../landing/landing.component.scss',
  ],
})

export class CreateroomComponent implements OnInit {
  show: boolean = true;
  localData: any;
  constructor(
    private modalService: NgbModal,
    public modal: ModelLocater,
    public socketsev: SocketconnectionServices,
    public sound: SoundService,
    private localDb: LocalDbService
  ) {
    this.localData = this.localDb.getSessionData();
  }

  ngOnInit(): void {
    this.socketsev.fetchRoomsPeriodically = true;
    this.socketsev.getRooms('lobby');
  }

  ngOnDestroy(): void {
    console.info('DESTROY CREATEROOM COMPONENT');
    this.socketsev.fetchRoomsPeriodically = false;
  }

  selectMode(mode: string) {
    this.modal.gameMode = mode;
    console.log('game mode>>', this.modal.gameMode);
  }

  debounceHandleJoinPublicRoom = this.debounce(this.joinRoom.bind(this),500);

  debounce(fn:Function,delay:number){
    let timer:any;
    return function (...args:any){
      if(timer)clearTimeout(timer);
      
    timer= setTimeout(() => {
        console.log('check fn',fn,delay,...args);
        fn(...args);
      }, delay);
    }
  }

  joinRoom(roomid: any) {
    let userObj = {
      userName: this.modal.userName,
      coin: 100,
      avatar: this.modal.profileSrc,
      dbId: this.localData.userId,
      // dbId: Math.floor(Math.random() * 10000)+'',
      mode: 'normal',
      roomType: 'private',
      gameMode: this.modal.gameMode,
      token: this.localData.accessToken,
    };
    this.socketsev.Join(roomid, userObj);
    this.modal.userId = userObj.dbId;
    console.log('create dbId', this.modal.userId);
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
