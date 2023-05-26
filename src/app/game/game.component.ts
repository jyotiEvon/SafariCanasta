import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { GameScreen } from '../phaserScreens/gameScreen';
import { SocketconnectionServices } from '../services/socketconnection.service';
// declare function leaveGame(element: any): any;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameScreen]
})
export class GameComponent implements OnInit {
  protected gamePlaySubscriptions: Subscription[] = [];
   game:any
 
  constructor(private gameScreen : GameScreen , private socketsvc: SocketconnectionServices,public modal:ModelLocater,public router:Router) {
    console.log("created ");
    // if (!socketsvc.client) {
    //   this.router.navigate(['/landing', {}]);
    // }
   }
     //phaser setup
  public readonly GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      width: window.innerWidth * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
      parent: 'game',
      enableDebug: false,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    renderer: Phaser.AUTO,
    enableDebug: false,
    scene: this.gameScreen,
    physics: {
      default: 'arcade',
    },
    backgroundColor: '#333333',
    banner: true
  }

  ngOnInit(): void {
    this.game = new Phaser.Game(this.GameConfig);
    console.log("phaser created ", this.game)
    this.gameScreen.gameComponent = this;
    this.gameScreen.socketConnection = this.socketsvc;

    // let userObj = {
    //   userName: 'Con' + Math.floor(Math.random() * 100).toString(),
    //   coin: 100,
    //   avatar: "1",
    //   dbId: Math.floor(Math.random() * 10000),
    //   mode: 'normal'
    // }
    // this.socketsvc.connectServer(userObj)
  }

  // ngOnDestroy(): void {
  //   console.log("DESTROYROOM")
  //   this.modal.gameRoom.leave();
  // }

  startGame() {
    console.log("starting server game")
    this.socketsvc.connectToPhaserRoom();
  }

  // public sendSelectedCard(card: any) {
  //   console.log("played server card sending ", card)
  //   this.modal.gameRoom.send("CARD", { cardId: card });
  // }


  leaveGame() {
    this.modal.roomCodeToJoinAndShare = '';
    this.modal.userId = 0;
    this.modal.gameRoom.leave();
    this.modal.gameRoom = null; ///check
    this.modal.gameplay = ''
    this.modal.gamePlayer = [];
    this.modal.playersInRoom = [];
    this.modal.teamName = 'A';
    this.modal.userServerIndex = null;
    this.modal.seatOnServer = 0;
    this.modal.roomId = '';
    this.modal.allPlayers = [];
    this.modal.players = [];
    this.modal.roomName = ''
    this.modal.rooms = [];
    this.modal.cardNewArray = [];
    this.modal.sortedArray = [];
    this.modal.myCards = [];
    this.modal.deckCard = [];
    this.modal.mycardArray = [];
    this.modal.gameplay = '';
    this.modal.hostPlayer = '';
    this.modal.gameMode = 'newbie';
    this.modal.gameModeType = '';
    this.modal.roomCode = '';
    this.modal.lobbydata = '';
    this.modal.isHost = false;
    this.modal.userName = '';
    this.modal.roomTitle = '';
    this.modal.roomConnected = false;
    this.modal.gameTimer = '4';
    this.modal.cardDistibuted = false;
    this.modal.cardFromDeck = false;
    this.modal.message = '';
    this.modal.showErrorMessage = false;
    this.modal.showResult = false;
    this.modal.gameState = '';
    this.modal.cardLeft = 0;
    this.modal.playerName = '';
    this.modal.rightMeld = [];
    this.modal.leftMeld = [];
    this.modal.specialMeldRight = [];
    this.modal.specialMeldLeft = [];
    this.modal.playerIndex = 0;
    this.modal.currentTurnSeat = 0;
    this.modal.chatPopup1 = { display: true, text: "", emoji: ""};;
    this.modal.chatPopup2 = { display: true, text: "", emoji: "" };
    this.modal.chatPopup3 = { display: true, text: "", emoji: "" };;
    this.modal.chatPopup4 ={ display: true, text: "", emoji: "" };;
    this.modal.path = '/assets/img/users/lion.png';
    this.modal.authError = '';
    this.modal.editProfile =false;
    this.modal.avartarProfile ='/assets/img/users/lion.png';
    this.modal.profileSrc ='';
    this.modal.bestHand =0;
    this.modal.defeats =0;
    this.modal.gems =0;
    this.modal.handsPlayed =0;
    this.modal.handsLost =0;
    this.modal.handsWon =0;
    this.modal.highestScore =0;
    this.modal.victories =0;
    this.modal.unfinishedGames =0;
    this.modal.avatar ='/assets/img/users/lion.png';
    this.modal.email ='';
    this.modal.getToken='' ;
    this.modal.updateusername='' ;
    this.modal.myIndex=-1 ;
    this.modal.leaderBoard=[];
    this.modal.soundObj= [
      {"path":'assets/Audio/bg-Music.mp3', "code":"backgroundMusic"},
      {"path":'assets/Audio/btn-sound.mp3', "code":"btnSound"},
  ];

  this.modal.profileObj = [
    {"path":'assets/img/users/gorilla.png', "name":"gorilla"},
    {"path":'assets/img/users/crocodile.png', "name":"crocodile"},
    {"path":'assets/img/users/elephant.png', "name":"elephant"},
    {"path":'assets/img/users/giraffe.png', "name":"giraffe"},
    {"path":'assets/img/users/lion.png', "name":"lion"},
    {"path":'assets/img/users/ostrich.png', "name":"ostrich"},
    {"path":'assets/img/users/rhino.png', "name":"rhino"},
    {"path":'assets/img/users/s.png', "name":"s"},

]

  // this.modal.gameSoundSetting = true;
  // this.modal.musicSetting = true;
  this.modal.accessToken = '';
  this.modal.showLoader = false;
  this.modal.meldHistory  = [];
  this.modal.roomExist  = false;
  this.modal.errorInRoomConnect  = '';
  this.modal.lobby  = null;
  this.modal.currentPlayerState  = null;
  this.modal.networkConnected  = true;
  this.modal.reconnectPopup  = false;
  this.modal.gameLoad  = false;
  this.modal.networkState  = false;
  this.modal.isReconnect  = false;
  this.modal.phaserProgressValue  = 0;
  this.modal.showPhaserProgressBar  = false;
  this.modal.networkStatus  = false;
 this.modal.isOffline = false;


  this.modal.teamScore = {
    status:'',
    myTeam: 0,
    rivalsTeam: 0,
    totalMyTeam: 0,
    totalRivalsTeam: 0,
    roundSummaryMyTeam: {
        finishedP: 0,
        handCardsP: 0,
        meldedCardsP: 0,
        naturalCanastasP: 0,
        mixedCanastasP: 0,
        acesCanastasP: 0,
        sevensCanastasP: 0,
        wildsCanastasP: 0,
        specialCanastasP: 0,
    },
    roundSummaryRivalsTeam: {
        finishedP: 0,
        handCardsP: 0,
        meldedCardsP: 0,
        naturalCanastasP: 0,
        mixedCanastasP: 0,
        acesCanastasP: 0,
        sevensCanastasP: 0,
        wildsCanastasP: 0,
        specialCanastasP: 0,
    },
    winningTeam: "",
    gameWinningTeam: "",
    specialHandMyTeam: "",
    specialHandRivalsTeam:"",
}

  for (let subs of this.gamePlaySubscriptions) {
    subs.unsubscribe();
  }

    // this.game.scene.remove('GameScreen');
    this.game.scene.remove('Card');
    this.game.scene.remove('TurnHighlighter1');
    this.game.scene.remove('Header');
    this.game.scene.remove('Table');
    this.game.destroy(true);
    // console.log("game destroyed ", this.game);
    this.router.navigateByUrl('landing', { skipLocationChange: false });
    // this.router.navigateByUrl('landing', { skipLocationChange: false }).then(() => window.location.reload());

  }

}


