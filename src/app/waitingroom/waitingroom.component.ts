import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject, Subscription } from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';
import { SoundService } from '../services/sound.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.scss'],
})
export class WaitingroomComponent implements OnInit {
  lobby: any;
  show: boolean = true;
  index: number = 0;
  tempLobby: any;
  you: { name: string; avatar: string; isHost: boolean } = {
    name: '',
    avatar: '',
    isHost: false,
  };
  left: { name: string; avatar: string; isHost: boolean } = {
    name: '',
    avatar: '',
    isHost: false,
  };
  top: { name: string; avatar: string; isHost: boolean } = {
    name: '',
    avatar: '',
    isHost: false,
  };
  right: { name: string; avatar: string; isHost: boolean } = {
    name: '',
    avatar: '',
    isHost: false,
  };
  // defaultProfile:any = '../assets/img/users/profilep.png';
  defaultProfile: any = '../../assets/img/profilep.png';
  playersInRoom: any = [];
  countPlayersInlobby:any = 0;

  protected gamePlaySubscriptions: Subscription[] = [];
  // modalService: any;
  constructor(
    public modal: ModelLocater,
    public socketsvc: SocketconnectionServices,
    public router: Router,
    private modalService: NgbModal,
    public sound: SoundService
  ) {
    this.subscribeToEvents();
    this.subscribeToLobbyObject();
    this.subscribeToLobbyData();
    this.subscribeToLobbyOnRemove();
    this.subscribeToLeaveLobby();
    // leaveLobbyAfterReconnect
    this.subscribeToLeaveLobbyAfterReconnection();
  }

  ngOnInit(): void {
    this.calcSeat(false);
    if(this.modal.isHost){
      let  nonNullarr = this.modal.playersInRoom.filter(Boolean);
      this.countPlayersInlobby = nonNullarr.length;
    }

  }

  completeSelectedFeatures() {
    this.socketsvc.lobbyData.complete();
    this.socketsvc.lobbyData = new ReplaySubject<{ [key: string]: any }>(1);
    // this.selectedFeaturesObservable$ = this.selectedFeatures.asObservable()
  }
  subscribeToLeaveLobbyAfterReconnection(){
    let temp = this.socketsvc.leaveLobbyAfterReconnect.subscribe((data: any) => {
      console.log(data, 'LeaveLobbyAfterReconnection',this.modal.reconnectPopup);
      if (data && JSON.stringify(data) != '{}') {
       console.log(data, 'aaaaa',this.modal.reconnectPopup);

        this.leaveLobby();
        setTimeout(() => {
        this.modal.reconnectPopup = false;
        }, 700);
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  subscribeToLeaveLobby() {
    let temp = this.socketsvc.leftLobby.subscribe((data: any) => {
      console.log(data, 'leave lobby');
      if (data && JSON.stringify(data) != '{}') {
        this.modalService.dismissAll();
        console.log('dismiss background');
        this.router.navigateByUrl('/landing', { skipLocationChange: false });
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }
  leaveLobby() {
    console.log('LEAVE WAITING ROOM');
    this.modal.lobbydata?.leave();
    this.modalService.dismissAll();
    // this.modal.isHost = false
    console.log('dismiss background');
    this.resetLobby();
    
    // this.socketsvc.lobbyData.next({});
    this.router.navigateByUrl('/landing', { skipLocationChange: false });
    
  }

  resetLobby() {
    console.log('A_BEFOREEE', this.you, this.top, this.right, this.left);
    this.resetSeats();
    this.modal.playersInRoom = [];
    this.modal.roomCodeToJoinAndShare = "";
    this.modal.isHost = false
    console.log('A_AFTERR', this.you, this.top, this.right, this.left);
  }
  resetSeats(){
    this.you = {
      name: '',
      avatar: '',
      isHost: false,
    };
    this.top = {
      name: '',
      avatar: '',
      isHost: false,
    };
    this.left = {
      name: '',
      avatar: '',
      isHost: false,
    };
    this.right = {
      name: '',
      avatar: '',
      isHost: false,
    };

  }

  subscribeToLobbyData() {
    let temp = this.socketsvc.lobbyData.subscribe((data: any) => {
      console.log(data, '2_Player Add');
      if (data && JSON.stringify(data) != '{}') {
        // this.playersInRoom.push(data);
        // this.playersInRoom[parseInt(data.index) - 1] = data;
        let  nonNullarr = this.modal.playersInRoom.filter(Boolean);
        this.countPlayersInlobby = nonNullarr.length;
        console.log('CheckPlayers', this.modal.playersInRoom, this.modal.myIndex ,this.countPlayersInlobby);
        console.log('01CheckPlayers', this.countPlayersInlobby);
        if (this.modal.myIndex > -1) this.calcSeat(false);
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  subscribeToLobbyOnRemove() {
    let temp = this.socketsvc.lobbyDataOnRemove.subscribe((data: any) => {
      let seatData: any;
      console.log(data, 'data');
      if (data && JSON.stringify(data) != '{}') {
        console.log('_playeLeftLobby ', data, this.modal.playersInRoom);
      let  nonNullarr = this.modal.playersInRoom.filter(Boolean);
      this.countPlayersInlobby = nonNullarr.length;
      console.log(' this.countPlayersInlobby', this.countPlayersInlobby)
        if (data.isHost) {
          if(!this.modal.lobbydata.state.isGameStarted){
            
            this.leaveLobby();
          }
          // this.resetLobby()
          // let _i = this.playersInRoom.findIndex((p: any) => p.index == data.index )
          // console.log("QQQQQ", _i);
          // seatData= this.playersInRoom[_i].seat;
          // console.log('_seatData',seatData)
          // this.getPlayersSeat(seatData,_i,true)
          this.modal.playersInRoom = [];
        } else{
          this.calcSeat(true)
        }
        // else {
        //   let _i = this.playersInRoom.findIndex(
        //     (p: any) => p.index == data.index
        //   );
        //   console.log('QQQQQ', _i);
        //   seatData = this.playersInRoom[_i].seat;
        //   console.log('_seatData', seatData);
        //   this.getPlayersSeat(seatData, _i, true);
        //   this.playersInRoom.splice(_i, 1);
        // }

        // let _i = this.playersInRoom.findIndex(
        //   (p: any) => p.index == data.index
        // );
        // console.log('QQQQQ', _i);
        // seatData = this.playersInRoom[_i].seat;
        // console.log('_seatData', seatData);
        // this.getPlayersSeat(seatData, _i, true);
        // this.playersInRoom.splice(_i, 1);
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  calcSeat(onRemove: boolean): any {
    // debugger
    // this.modal.userId
    let seat = 0;
    let index = 0;
    let count = 2;
    let i = 0;

    this.resetSeats();

    for (let player of this.modal.playersInRoom) {
      if(player){
        player.seat = ((4 + (i - (this.modal.myIndex - 1))) % 4) + 1
        this.getPlayersSeat(player, false);
      }
      i++;

      // if (player.seat == 1) {
      //   seat = player.seat = 1;
      // } else {
      //   if (this.modal.myIndex == 1) {
      //     seat = player.seat = count;
      //     count = count + 1;
      //   } else {
      //     let divisor;
      //     divisor =
      //       (this.modal.myIndex + 1) % 4 ? this.modal.myIndex + (1 % 4) : 2;
      //     seat = player.seat =
      //       (player.index + divisor) % 4 ? (player.index + divisor) % 4 : 4;
      //   }
      // }
      //  Object.assign(this.playersInRoom,{'seat':seat});

    }

    console.log('CheckPlayers@@@', this.modal.playersInRoom);

    // console.log('CheckPlayers', this.playersInRoom);
  }

  getPlayersSeat(player: any, onRemove: boolean): any {
    // debugger
    // this.model.selectProfile('lion')
    console.log('+++++', player, onRemove, this.modal.playersInRoom);

    let seatPlayer = {
      name: player.name,
      avatar: player.avatar,
      isHost: player.isHost,
    };
    let seatDefault = {
      name: 'WAITING',
      avatar: this.defaultProfile,
      isHost: false,
    }

    switch (player.seat.toString()) {
      case '1':
        // console.log("!!!!case 1",this.playersInRoom[index],this.playersInRoom[index].avatar)
        onRemove
          ? (this.you = seatDefault)
          : (this.you = seatPlayer);
        break;

      case '2':
        onRemove
          ? (this.left = seatDefault)
          : (this.left = seatPlayer);
        break;

      case '3':
        onRemove
          ? (this.top = seatDefault)
          : (this.top = seatPlayer);
        break;

      case '4':
        onRemove
          ? (this.right = seatDefault)
          : (this.right = seatPlayer);
        break;
    }
  }

  ngOnDestroy(): void {
    console.log('DESTROY WAITING ROOM');
    this.modal.lobbydata?.leave();
    // this.socketsvc.lobbyData.next({});

    // for (let subs of this.gamePlaySubscriptions) {
    //   subs.unsubscribe();
    // }
  }

  subscribeToEvents() {
    this.subscribeToGameStart();
  }

  subscribeToGameStart() {
    let temp: Subscription;
    console.log('subscribetogamestart');
    temp = this.socketsvc.leaveLobby.subscribe((data) => {
      console.log(data, 'data');
      if (data && JSON.stringify(data) != '{}') {
        console.log('game start listened>> ', data, this.lobby);
        this.startGameRoom();
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  subscribeToLobbyObject() {
    console.log('subscribetolobby');
    // let temp: Subscription;

    let temp = this.socketsvc.setLobbyObject.subscribe((lobby: any) => {
      if (lobby && JSON.stringify(lobby) != '{}') {
        console.log('subscribetolobby', lobby);
        this.lobby = lobby;
        // this.model.roomName = lobby.name;
      }
    });
    this.gamePlaySubscriptions.push(temp);
    // temp = this.socketsvc.startPrivateRoom.subscribe((data) => {
    //   this.lobby.send('PLAYER_JOINED', {message: 'hello'});
    // });
    // this.subscriptions.push(temp);
  }

  startGameRoom() {
    this.show = false;
    this.modalService.dismissAll();
    console.log('dismiss background');
    this.router.navigateByUrl('/gameplay', { skipLocationChange: false });
  }
  startGame() {
    this.modal.lobby.send('START_GAME');
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }
}
