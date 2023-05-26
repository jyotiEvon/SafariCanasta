import { NoopAnimationPlayer } from "@angular/animations";
import { invalid } from "@angular/compiler/src/render3/view/util";
import { Injectable } from "@angular/core";
import { SoundService } from "../services/sound.service";

@Injectable({
    providedIn: 'root'
})

export class ModelLocater{
    // music: boolean;
    constructor(){
        
    }
    public roomCodeToJoinAndShare:any ;
    public userId:any = 0;
    public gameRoom: any;
    public gamePlayer: any = [];
    public gameplay: any;
    public playersInRoom:any=[];
    public teamName = "A";
    public seatOnServer:any = 0;
    public roomId:string = '';
    public userServerIndex:any = null;
    public allPlayers:any = [];
    public players: any = [];
    public roomName: string = "";
    public hostPlayer: any;
    public gameMode:string='newbie';
    public gameModeType:string = 'newbie';
    public roomCode:any;
    public lobbydata:any;
    public isHost:boolean=false;
    public userName:string='';
    public roomTitle:string = ''
    public rooms: any = [];
    public cardNewArray: any = [];
    public sortedArray: any = [];
    public myCards:any =[];
    public roomConnected:boolean = false;
    public gameTimer:any ='4';
    public cardDistibuted= false;
    public deckCard: any = [];
    public cardFromDeck:boolean = false;
    public mycardArray :any =[];
    public subscribeTimer:any;
    public firstDiscardCard:boolean = true;
    public message: any = "";
    public showErrorMessage: boolean = false;
    public showResult:boolean = false;
    public gameState:string = ''
    public cardLeft:any=0;
    public playerName:any = '';
    public rightMeld:any =[]
    public leftMeld:any =[]
    public specialMeldRight:any =[]
    public specialMeldLeft:any =[];
    public playerIndex:number = 0;
    public currentTurnSeat:number = 0;
    public chatPopup1 = { display: true, text: "", emoji: ""};
    public chatPopup2 = { display: true, text: "", emoji: "" };
    public chatPopup3 = { display: true, text: "", emoji: "" };
    public chatPopup4 = { display: true, text: "", emoji: "" };
    public path:any ="/assets/img/users/lion.png";

    public authError:any = '' ;
    public editProfile:boolean = false;
   
    //Player's profile
    public avartarProfile:string = '/assets/img/users/lion.png';
    public profileSrc:string = '';
    public bestHand:any= 0;
    public defeats:any= 0;
    public gems:any= 0;
    public handsPlayed:any= 0;
    public handsLost:any= 0;
    public handsWon:any= 0;
    public highestScore:any= 0;
    public victories:any= 0;
    public unfinishedGames:any = 0;

    public avatar:string = '/assets/img/users/lion.png';
    public email:any = '';
    public getToken:any='';
    public updateusername:string=''

    public myIndex:any = -1;

    public leaderBoard:{gems:number,rank:number,username:string,avatar:string,totalScore:number,id:string}[]=[]
  
   
    public soundObj = [
        {"path":'assets/Audio/bg-Music.mp3', "code":"backgroundMusic"},
        {"path":'assets/Audio/btn-sound.mp3', "code":"btnSound"},
    ];

    public profileObj = [
        {"path":'assets/img/users/gorilla.png', "name":"gorilla"},
        {"path":'assets/img/users/crocodile.png', "name":"crocodile"},
        {"path":'assets/img/users/elephant.png', "name":"elephant"},
        {"path":'assets/img/users/giraffe.png', "name":"giraffe"},
        {"path":'/assets/img/users/lion.png', "name":"lion"},
        {"path":'assets/img/users/ostrich.png', "name":"ostrich"},
        {"path":'assets/img/users/rhino.png', "name":"rhino"},
        {"path":'assets/img/users/s.png', "name":"s"},
    ]

    public musicSetting:boolean = true;
    public gameSoundSetting:boolean = true;
    public accessToken:any
    public showLoader:boolean = false;
    public meldHistory:any = [];
  
    public roomExist:boolean = false;
    public errorInRoomConnect:string = '';
    public lobby:any;

    public currentPlayerState:any;
    public networkConnected: boolean = true;
    public reconnectPopup:boolean = false;
    public gameLoad:boolean=false;
    public networkState:boolean=false;
    public isReconnect: boolean = false;

    public phaserProgressValue:any = 0;
    public showPhaserProgressBar:boolean = false;
    public networkStatus:boolean = false;
    public isOffline:boolean = false;

    public teamScore = {
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


}