import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription, fromEvent, map, merge, of } from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { SocketconnectionServices } from '../services/socketconnection.service';
import { SoundService } from '../services/sound.service';
import { LocalDbService } from '../services/local-db.service';
import { NetworkStatusService } from '../services/network-status.service';
declare let window:any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})

export class LandingComponent implements OnInit {
  webshareService: any;
  clickTimeOut: any = null;
  

  // profileSrc:any;
  @ViewChild('waitingroom') waitingroom: TemplateRef<any> | undefined;
  @ViewChild('privateroom') privateroom: TemplateRef<any> | undefined;
  @ViewChild('errorInRoom') errorInRoom: TemplateRef<any> | undefined;

  public createRoomModalRef: NgbModalRef | undefined;
  public roomListingModalRef: NgbModalRef | undefined;
  public joinRoomMsgRef: NgbModalRef | undefined;
  localData: any;
  protected gamePlaySubscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    public socketsvc: SocketconnectionServices,
    public router: Router,
    public modal: ModelLocater,
    public sound: SoundService,
    private api: ApiService,
    private localDb: LocalDbService,
    
    private checkNetworkStatus: NetworkStatusService
  ) {
    this.subscribeToServices();
  }

  ngOnInit(): void {
   
    setTimeout(() => {

      if(this.modal.musicSetting){
        this.sound.setMusic();
      }
    }, 2000);

    this.localData = this.localDb.getSessionData();
    console.log('Local Data:=>>>', this.localData);

    this.api
      .getProfileInfo(this.localData.accessToken)
      .subscribe((res: any) => {
        console.log('_profileInfo', res);
        this.modal.userId = res.data.user.id;
        this.modal.userName = res.data.user.username;
        this.modal.email = res.data.user.email;
        this.modal.avatar = res.data.user.avatar;
        this.modal.gems = res.data.career.gems;
        this.modal.victories = res.data.career.victories;
        this.modal.defeats = res.data.career.defeats;
        this.modal.highestScore = res.data.career.highest_score;
        this.modal.handsPlayed = res.data.career.hands_played;
        this.modal.bestHand = res.data.career.best_hands;
        this.modal.handsWon = res.data.career.hands_won;
        this.modal.handsLost = res.data.career.hands_lost;
        this.modal.unfinishedGames = res.data.career.unfinished_games;
      },(err:any)=>{
        console.log('tokenExpire',err.status);
        if(err.status == 401){
          this.logout()
          this.router.navigateByUrl('login', {
            skipLocationChange: false,
          });
        }
      });
  }

  // onDeviceReady() {
  //   console.log('Device is ready');
  //   alert('Device is ready');
  //   this.checkNetwork();
  // }

  // checkNetwork() {
  //   this.checkNetworkStatus.checkNetworkConnection();
  // }

  subscribeToServices(){
    this.subscribeToRoomConnect();
    this.subscribeToErrorInRoomConnect();
  }

  subscribeToRoomConnect() {
    let temp = this.socketsvc.roomConnected.subscribe((data: any) => {
      console.log(data, 'connect with lobby');
      if (data && JSON.stringify(data) != '{}') {
        if (!data.isPrivateRoom) {
          this.roomListingModalRef?.dismiss('Cross click');
          this.openWR(this.waitingroom);
        }
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  subscribeToErrorInRoomConnect() {
    let temp = this.socketsvc.errorInRoomConnect.subscribe((data: any) => {
      console.log(data.message, 'error connecting lobby');
      if (data && JSON.stringify(data) != '{}') {
        this.openWR(this.errorInRoom);
        this.modal.errorInRoomConnect = data.message;
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  ////open template////
  openWL(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'winlose',
    });
  }
  openCR(content: any) {
    this.roomListingModalRef = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'ctRoom',
    });
  }
  openSm(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  openLB(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'lboardWrap',
    });
  }
  openPF(content: any) {
    this.modalService.open(content, { centered: true, size: 'xl' });
  }
  openst(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'settingWrap',
    });
  }

  openHp(content: any) {
    this.modalService.open(content, {
      fullscreen: true,
      modalDialogClass: 'dark-modal',
    });
  }

  openRS(content: any) {
    this.createRoomModalRef = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: '',
    });
  }

  openWR(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: '',
    });
  }

  openPR(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: '',
    });
  }

  openPRC(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: '',
    });
  }
  openJR(content: any) {
    this.joinRoomMsgRef = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: '',
    });
  }

  openER(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'winlose',
    });
  }

  ////******////

  createRoomCode() {
    this.modal.isHost = true;
    let userObj = {
      userName: this.modal.userName,
      coin: 100,
      avatar: this.modal.profileSrc,
      dbId: this.localData.userId,
      // dbId: Math.floor(Math.random() * 10000) + '',

      mode: 'normal',
      roomType: 'private',
      gameMode: this.modal.gameMode,
      token: this.localData.accessToken,
    };
    this.socketsvc.connectServerFriend(userObj);
    this.openPRC(this.privateroom);
    

    // console.log(this.gameMode.gameMode)
  }

  // saveProfileChanges(){
  //   this.modal.profileSrc = this.modal.avartarProfile;
  //   console.log('this.modal.profileSrc',this.modal.profileSrc);
  //   // this.api.updateProfile(this.modal.profileSrc,this.modal.updateusername).subscribe(res=>{
  //     console.log('_updateProfileRes',res);
  //     this.modal.avatar  = res.data.user.avatar;
  //     this.modal.userName = res.data.user.username;

  //     // this.modal.selectProfile( this.modal.avatar);
  //     // profile.selectProfile(this.modal.avatar)

  //   })

  // }lobby

  joinPrivateGame() {
    // joinFriendsRoom
    let userObj = {
      userName: this.modal.userName,
      coin: 100,
      avatar: this.modal.profileSrc,
      dbId: this.localData.userId,
      // dbId: Math.floor(Math.random() * 10000) + '',
      mode: 'normal',
      roomType: 'private',
      gameMode: this.modal.gameMode,
      token: this.localData.accessToken,
    };
    console.log('room code', this.modal.roomCode);

    this.socketsvc.joinFriendsRoom(userObj, this.modal.roomCode);
    this.joinRoomMsgRef!.dismiss('Cross click');

    // this.openWR(this.waitingroom);

    console.log('create dbId', this.modal.userId, this.modal.accessToken);
  }

  //prevent multipe click event
  debounceHandleCreatePublicRoom = this.debounce(
    this.createPublicRoom.bind(this),
    2000
  );
  debounceHandleJoinPrivateRoom = this.debounce(
    this.joinPrivateGame.bind(this),
    2000
  );

  debounce(fn: Function, delay: number) {
    let timer: any;
    return function (...args: any) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        console.log('check fn', fn, delay);
        fn();
      }, delay);
    };
  }

  ///////////

  createPublicRoom() {
    this.modal.isHost = true;
    let userObj = {
      userName: this.modal.userName,
      coin: 100,
      avatar: this.modal.profileSrc,
      dbId: this.localData.userId,
      // dbId: Math.floor(Math.random() * 10000) + '',

      mode: 'normal',
      roomType: 'public',
      gameMode: this.modal.gameMode,
      roomTitle: this.modal.roomTitle,
      token: this.localData.accessToken,
    };

    if (
      this.modal.rooms.find(
        (r: any) => r.metadata.roomTitle === userObj.roomTitle
      )
    ) {
      // alert('Room with same name is already exist. please use another name.');
      this.openWR(this.errorInRoom);
      this.modal.errorInRoomConnect = 'Room with same name already exist.Please use another name.';
      return;
    }

    this.socketsvc.connectServer(userObj);
    this.createRoomModalRef!.dismiss('Cross click');
    // this.openWR(this.waitingroom);
    
    this.modal.userId = userObj.dbId;
    console.log('create dbId', this.modal.userId, this.modal.accessToken);
  }
  // public leaderBoard:{gems:number,rank:number,username:string,avatar:string}[]=[]
  //

  startPrivateRoom() {
    this.openWR(this.waitingroom);
  }

  logout() {
    this.sound.stopSound();
    this.modal.userId = '';
    this.modal.userName = '';
    this.modal.avatar = '';
    this.modal.email = '';
    this.modal.accessToken = '';
    this.modal.defeats = 0;
    this.modal.gems = 0;
    this.modal.handsLost = 0;
    this.modal.handsWon = 0;
    this.modal.handsPlayed = 0;
    this.modal.highestScore = 0;
    this.modal.unfinishedGames = 0;

    this.localDb.removeStorage();
    // this.api.resetLocalDb();
    this.router.navigateByUrl('login', {
      skipLocationChange: false,
    });
  }
  showLeaderboard() {
    console.log('_hitLboardApi', this.modal.showLoader);
    this.modal.showLoader = true;
    this.api.leaderBoard(10, this.localData.accessToken).subscribe(
      (res: any) => {
        console.log('_leaderBoardRes', res);
        this.modal.leaderBoard = [];
        this.modal.showLoader = false;

        for (let i = 0; i < res.data.length; i++) {
          this.modal.leaderBoard.push({
            gems: res.data[i].gems,
            rank: res.data[i].rank,
            username: res.data[i].user.username,
            avatar: res.data[i].user.avatar,
            totalScore: res.data[i].total_score,
            id: res.data[i].user.id,
          });
        }
        console.log('lederboard', this.modal.leaderBoard);
      },
      (err) => {
        console.log('_errorInLeaderBoard', err);
        this.modal.showLoader = false;
      }
    );
  }

  shareCode() {
    var options = {
      message: "Join my Safari Canasta's game room with the code: " + this.modal.roomCodeToJoinAndShare, // not supported on some apps (Facebook, Instagram)
      subject: 'Safari Canasta Private Room', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
    };
    
    var onSuccess = function(result:any) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };
    
    var onError = function(msg:any) {
      console.log("Sharing failed with message: " + msg);
    };
    console.log(window);
    console.log(window.plugins)
    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
  }

  shareApp(){

  }


  //

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }
}
