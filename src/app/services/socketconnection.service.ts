// import { NoopAnimationPlayer } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'colyseus.js';

// import { Router } from '@angular/router';
import {
  Observable,
  ReplaySubject,
  Subscription,
  fromEvent,
  map,
  merge,
  of,
} from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { LocalDbService } from './local-db.service';
import { NetworkStatusService } from './network-status.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Cards } from '../phaserScreens/cards';

@Injectable({
  providedIn: 'root',
})
export class SocketconnectionServices {
  client: any;
  currentGameStatus: any = 'NONE';
  winningTeam: any;
  timeLeft: any = 0;
  roundCount: any = 0;
  myIndex: any = 0;
  // port = 'ws://3.18.57.54:2567'; // dev server
  port = 'ws://3.18.57.54:2568'; // live server
  // port = 'ws://localhost:2567'; // dev server

  public leaveLobby: ReplaySubject<{ [key: string]: string }>;
  public setLobbyObject: ReplaySubject<{ [key: string]: string }>;
  public newCard: ReplaySubject<{ [key: string]: string }>;
  public stockPile: ReplaySubject<{ [key: string]: string }>;
  public discardedPile: ReplaySubject<{ [key: string]: string }>;
  public setRoomObject: ReplaySubject<{ [key: string]: string }>;
  public myTurn: ReplaySubject<{ [key: string]: string }>;
  public gameTimer: ReplaySubject<{ [key: string]: any }>;
  public startTimer: ReplaySubject<{ [key: string]: string }>;
  public meldDataA: ReplaySubject<{ [key: string]: string }>;
  public meldDataB: ReplaySubject<{ [key: string]: string }>;
  public myPlayingTurn: ReplaySubject<{ [key: string]: string }>;
  public cardRemoved: ReplaySubject<{ [key: string]: string }>;
  public pointsUpdateA: ReplaySubject<{ [key: string]: string }>;
  public pointsUpdateB: ReplaySubject<{ [key: string]: string }>;
  public playAnimation: ReplaySubject<{ [key: string]: string }>;
  public meldRequired: ReplaySubject<{ [key: string]: string }>;
  // public playerInfo: ReplaySubject<{ [key: string]: string; }>;
  public playerName: ReplaySubject<{ [key: string]: string }>;
  public cardCount: ReplaySubject<{ [key: string]: string }>;
  public minimumMeldTeamA: ReplaySubject<{ [key: string]: string }>;
  public minimumMeldTeamB: ReplaySubject<{ [key: string]: string }>;
  public winnerTeam: ReplaySubject<{ [key: string]: string }>;
  public roundSummeryA: ReplaySubject<{ [key: string]: string }>;
  public roundSummeryB: ReplaySubject<{ [key: string]: string }>;
  public Round: ReplaySubject<{ [key: string]: string }>;
  public commulativeScoreA: ReplaySubject<{ [key: string]: string }>;
  public commulativeScoreB: ReplaySubject<{ [key: string]: string }>;
  public gameOver: ReplaySubject<{ [key: string]: string }>;
  public undoMeldA: ReplaySubject<{ [key: string]: string }>;
  public undoMeldB: ReplaySubject<{ [key: string]: string }>;
  public playerCardAdded: ReplaySubject<{ [key: string]: string }>;
  public stockPileRemoved: ReplaySubject<{ [key: string]: string }>;
  public playerHandCardRemoved: ReplaySubject<{ [key: string]: string }>;
  public discardedPileRemoved: ReplaySubject<{ [key: string]: string }>;
  public meldCanastaUpdate: ReplaySubject<{ [key: string]: any }>;
  public fetchRoomsPeriodically: boolean = false;
  public chatData: ReplaySubject<{ [key: string]: string }>;
  public leaveGame: ReplaySubject<{ [key: string]: string }>;
  public lobbyData: ReplaySubject<{ [key: string]: string }>;
  public playerAvatar: ReplaySubject<{ [key: string]: string }>;
  public lobbyDataOnRemove: ReplaySubject<{ [key: string]: string }>;
  public leftLobby: ReplaySubject<{ [key: string]: any }>;
  public roomConnected: ReplaySubject<{ [key: string]: any }>;
  public errorInRoomConnect: ReplaySubject<{ [key: string]: any }>;
  public restoreState: ReplaySubject<{ [key: string]: any }>;
  public restorePhaser: ReplaySubject<{ [key: string]: any }>;
  public leaveLobbyAfterReconnect: ReplaySubject<{ [key: string]: any }>;

  // offlineEvent: Observable<Event>;
  // onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;

  constructor(
    public modal: ModelLocater,
    public router: Router,
    private localDb: LocalDbService,
    private checkNetworkStatus: NetworkStatusService,
    private modalService: NgbModal
  ) {
    this.leaveLobby = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.setLobbyObject = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.newCard = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.stockPile = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.discardedPile = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.setRoomObject = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.myTurn = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.gameTimer = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.startTimer = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.meldDataA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.meldDataB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.myPlayingTurn = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.cardRemoved = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.pointsUpdateA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.pointsUpdateB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.playAnimation = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.meldRequired = new ReplaySubject<{ [key: string]: string }>(1, 0);
    // this.playerInfo = new ReplaySubject<{ [key: string]: string; }>(1);
    this.playerName = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.cardCount = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.minimumMeldTeamA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.minimumMeldTeamB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.winnerTeam = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.roundSummeryA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.roundSummeryB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.Round = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.commulativeScoreA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.commulativeScoreB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.gameOver = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.undoMeldA = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.undoMeldB = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.playerCardAdded = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.stockPileRemoved = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.playerHandCardRemoved = new ReplaySubject<{ [key: string]: string }>(
      1,
      0
    );
    this.discardedPileRemoved = new ReplaySubject<{ [key: string]: string }>(
      1,
      0
    );
    this.chatData = new ReplaySubject<{ [key: string]: string }>(1, 0);
    this.meldCanastaUpdate = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.leaveGame = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.lobbyData = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.playerAvatar = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.lobbyDataOnRemove = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.leftLobby = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.roomConnected = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.errorInRoomConnect = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.restoreState = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.restorePhaser = new ReplaySubject<{ [key: string]: any }>(1, 0);
    this.leaveLobbyAfterReconnect = new ReplaySubject<{ [key: string]: any }>(1, 0);

    // this.onlineEvent = new Observable<Event>();
    // this.offlineEvent = new Observable<Event>();
    this.handleAppConnectivityChanges();
    
  }

  private offlineEventCallback = () => {
    console.log('Offline...');
  };
  private onlineEventCallback = () => {
    console.log('Online...');
  };

  handleAppConnectivityChanges() {
    console.log('handleAppConnectivityChanges.....', navigator.onLine);
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status: any) => {
        console.log('status', status);
        this.networkStatus = status;
        // this.modal.networkStatus = status;
        console.log(
          'Online...',
          this.modal.gameLoad,
          this.networkStatus,
          this.modal.isReconnect
        );
        if(this.networkStatus){
          this.modal.reconnectPopup = false;
          this.modal.isOffline = false;
        }

        if (this.networkStatus && this.modal.isReconnect) {
          // alert(status);
          if(!this.modal.lobbydata.state.isGameStarted){
            this.modal.reconnectPopup = true;
            this.leaveLobbyAfterReconnect.next({message:'Lobby left'})
            return;

          }
          if (!this.modal.gameLoad) {
            this.modal.reconnectPopup = true;
            this.restorePhaser.next({ message: 'restore phaser' });
          } else {
            this.modal.reconnectPopup = true;
            console.log('reconnectPopup...', this.modal.reconnectPopup);
            setTimeout(() => {
              this.tryReconnection();
            }, 1000);
          }
        } else if (!this.networkStatus) {
          // alert(status);
          console.log('Offline...');
          this.modalService.dismissAll();
          this.modal.reconnectPopup = true;
          this.modal.isOffline = true;
          this.modal.isReconnect = true;
          this.modal.networkConnected = false;
        }
      });
  }

  // private handleAppConnectivityChanges(): void {
  //   // this.onlineEvent = fromEvent(window, 'online');
  //   // this.offlineEvent = fromEvent(window, 'offline');

  //   console.log('handleAppConnectivityChanges');
  //   document.addEventListener("offline", this.offlineEventCallback);
  //   document.addEventListener("online", this.onlineEventCallback);

  //   // this.subscriptions.push(
  //   //   this.onlineEvent.subscribe((e) => {
  //   //     // handle online mode
  //   //     console.log('Online...');
  //   //     // setTimeout(()=>{
  //   //     //   this.modal.networkConnected = true;
  //   //     // }, 3000)
  //   //     // this.tryReconnection();
  //   //   })
  //   // );

  //   // this.subscriptions.push(
  //   //   this.offlineEvent.subscribe((e) => {
  //   //     // handle offline mode
  //   //     console.log('Offline...');
  //   //     this.modal.networkConnected = false;
  //   //     // this.modal.gameRoom.removeAllListeners();
  //   //     // this.modal.gameRoom.leave();
  //   //   })
  //   // );
  // }

  // handleAppConnectivityChanges(){
  //   console.log('handleAppConnectivityChanges.....')
  //   document.addEventListener("deviceready",
  //   () =>{
  //     setInterval(()=>this.onDeviceReady,1000)
  //   } ,

  //   false);
  // }

  onDeviceReady() {
    console.log('Device is ready');
    // alert('Device is ready');
    this.checkNetworkConnection();
  }
  checkNetworkConnection() {
    this.checkNetworkStatus.checkNetworkConnection();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public connectServer(userObj: any): any {
    this.client = new Client(this.port);
    console.log('User data ', userObj);
    console.log('client is ', this.client, ' port is ', this.port);
    this.Create('lobby', userObj);
  }

  //Create Public room Room
  public Create(type: any, userObj: any) {
    let map: { [key: string]: any } = {};

    this.client
      .create(type, userObj)
      .then((lobby: any) => {
        this.modal.lobby = lobby;
        this.setLobbyObject.next(lobby);
        console.log('Room created successfully >>', lobby, userObj);
        map['message'] = 'Room created successfully';
        map['isPrivateRoom'] = false;

        this.roomConnected.next(map);
        this.startPublicLobby(lobby, type);
        // this.getplayers(lobby)
      })
      .catch((e: any) => {
        console.log('Lobby JOIN ERROR', e);
        // alert('errror in connecting with lobby');
        map['message'] = 'Opps! Something went wrong';
        this.errorInRoomConnect.next(map);
      });
  }

  // join public room
  public Join(roomid: any, userObj: any) {
    let map: { [key: string]: any } = {};

    this.client = new Client(this.port);
    this.client
      .joinById(roomid, userObj)
      .then((lobby: any) => {
        this.modal.lobby = lobby;
        this.setLobbyObject.next(lobby);
        console.log('lobby joined successfully >>', lobby);
        // (document.querySelector('.ctRoom') as HTMLElement).style.display =
        //   'none';
        map['message'] = 'lobby joined successfully';
        map['isPrivateRoom'] = false;

        this.roomConnected.next(map);

        this.startPublicLobby(lobby, 'Random');
        // this.getplayers(lobby)
      })
      .catch((e: any) => {
        console.log('JOIN ERROR', e);
        map['message'] = 'Errror in joining with lobby';
        this.errorInRoomConnect.next(map);
      });
  }

  //get room list
  public getRooms(type: any) {
    // console.info("FETCHING ROOMS", type)
    this.client = new Client(this.port);
    this.client.getAvailableRooms(type).then((rooms: any) => {
      this.modal.rooms = [];
      rooms.forEach((room: any) => {
        console.log('rooms available>>>>', room);
        // console.log('roomsid>>>>', room.roomId)
        this.modal.rooms.push(room);
      });

      if (this.fetchRoomsPeriodically)
        setTimeout(() => {
          this.getRooms(type);
        }, 1000);
    });
  }

  // players in room
  // getplayers(room: any) {
  //   room.state.players.onAdd = (player: any, key: any) => {
  //     console.log('Player Add', player, key);
  //     console.log('player name', player.name);
  //     let seat =
  //       (this.modal.userServerIndex + player.index) % 4
  //         ? (((this.modal.userServerIndex + player.index) % 4) + 1).toString()
  //         : '3';
  //     // let seat= (((this.modal.userServerIndex + player.index) % 4) + 1).toString();
  //     Object.assign(player, { ['seat']: seat });
  //     console.log('checkPlayers>>', player);
  //     this.modal.playersInRoom.push(player);
  //   };
  // }

  //start Random lobby
  startLobby(lobby: any, roomtype: any) {
    this.modal.lobbydata = lobby;
    lobby.onMessage('JOINFINAL', (message: any) => {
      console.log('all player', message.gamePlayerList);
    });

    lobby.onMessage('ROOMCONNECT', (message: any) => {
      console.log('Room Connected', message);

      // lobby.leave();
      this.leaveLobby.next(message);
      console.log('lobby left');
      // this.leaveLobby.next(message);
    });
    lobby.onLeave((code: any) => {
      console.log('Client left the lobby', code);
      this.leftLobby.next(code);
    });

    // lobby.onDispose(() => {
    //   let message ={'msg':true}
    //   this.leftLobby.next(message);
    // })
  }

  public startPublicLobby(lobby: any, roomtype: any) {
    this.modal.lobbydata = lobby;
    this.modal.playersInRoom = [];
    lobby.onMessage('JOINFINAL', (message: any) => {
      console.log('all player', message.gamePlayerList);
      console.log('message', message);
    });

    lobby.onMessage('ROOM_CONNECT', (message: any) => {
      console.log(
        'Room Connected',
        message,
        message.team,
        message.seat,
        message.index
      );
      this.modal.teamName = message.team;
      this.modal.seatOnServer = message.seat;
      this.modal.userServerIndex = message.index;

      // lobby.leave();

      this.leaveLobby.next(message);
      console.log('lobby leave');
      // this.leaveLobby.next(message);
    });

    lobby.onLeave((code: any) => {
      console.log('Client left the lobby', code);
    });

    lobby.onError((code: any, message: any) => {
      console.log(code, message, '');
    });

    lobby.state.players.onAdd = (player: any, key: any) => {
      console.log('1_Player Add', player, key);
      let seat = 0;
      console.log('this.modal.myIndex', player.dbId, this.modal.userId);

      if (player.dbId == this.modal.userId) {
        seat = 1;
        this.modal.myIndex = player.index + 1;
        console.log('this.modal.myIndex', this.modal.myIndex, player.index);
      } else {
        seat = 0;
      }

      let map: { [key: string]: any } = {};
      map['name'] = player.name;
      map['avatar'] = player.avatar;
      map['seat'] = seat;
      map['index'] = player.index + 1;
      map['isHost'] = player.isHost;
      map['team'] = player.team;

      this.modal.playersInRoom[parseInt(player.index)] = map;

      this.lobbyData.next(map);
      console.log('_CHECKPLAYERS', this.modal.playersInRoom);
    };

    lobby.state.players.onRemove = (player: any, key: any) => {
      console.log('Player Remove', player, key);

      // let _i = this.modal.playersInRoom.findIndex((p: any) => p.id == player.id)
      // console.log("QQQQQ", _i);
      // this.modal.playersInRoom.splice(_i, 1);
      // console.log("Player left the lobby", player, key);
      let seat = 0;
      console.log('this.modal.myIndex', player.dbId, this.modal.userId);

      if (player.dbId == this.modal.userId) {
        seat = 1;
        this.modal.myIndex = player.index + 1;
        console.log('this.modal.myIndex', this.modal.myIndex, player.index);
      } else {
        seat = 0;
      }

      let map: { [key: string]: any } = {};
      map['name'] = player.name;
      map['avatar'] = player.avatar;
      map['seat'] = seat;
      map['index'] = player.index + 1;
      map['isHost'] = player.isHost;
      map['team'] = player.team;

      // REMOVE PLAYER FROM MODEL
      let _i = this.modal.playersInRoom.findIndex(
        (p: any) => p.index == player.index + 1
      );
      if (_i > -1) {
        // this.modal.playersInRoom.splice(_i, 1);
        this.modal.playersInRoom[_i] = null;
      }
      this.lobbyDataOnRemove.next(map);
    };
  }

  //create Private Lobby Room
  public connectServerFriend(userObj: any): any {
    // const port = 'wss://api.anytimebridge.com/';
    let map: { [key: string]: any } = {};

    this.client = new Client(this.port);
    this.client
      .create('lobby', userObj)
      .then((lobby: any) => {
        //
        this.modal.lobby = lobby;
        this.setLobbyObject.next(lobby);
        console.log('lobby Info friend >>', lobby, this.setLobbyObject);
        this.modal.roomCodeToJoinAndShare = lobby.id;
        console.log('rome code', this.modal.roomCodeToJoinAndShare);
        map['message'] = 'Private Room created successfully';
        map['isPrivateRoom'] = true;
        this.roomConnected.next(map);
        this.startPublicLobby(lobby, 'Random');
        // this.getplayers(lobby);
      })
      .catch((e: any) => {
        console.log('Lobby JOIN ERROR', e);
        alert('errror in connecting with lobby');

        map['message'] = 'errror in connecting with lobby';
        this.errorInRoomConnect.next(map);
      });
  }

  //Join Private Room
  public joinFriendsRoom(userObj: any, roomId: any) {
    console.log('inside functionJoin friend', roomId);
    // const port = 'ws://3.18.57.54:2567';
    let map: { [key: string]: string } = {};

    this.client = new Client(this.port);
    this.modal.roomExist = false;
    this.client
      .joinById(roomId, userObj)
      .then((lobby: any) => {
        console.log('lobby joined successfully >>', lobby);
        this.startPublicLobby(lobby, 'Random');
        // this.getplayers(lobby);
        map['message'] = 'lobby joined successfully';
        this.roomConnected.next(map);
        this.modal.lobby = lobby;

        this.setLobbyObject.next(lobby);
        this.modal.roomExist = true;
        console.log('JOIN friendivite ', this.modal.roomExist);
      })
      .catch((e: any) => {
        this.modal.roomExist = false;
        console.log('JOIN friendivite ERROR', e, this.modal.roomExist);
        map['message'] = 'Invalid room code';
        this.errorInRoomConnect.next(map);
        // alert('Room does not exist');
      });
  }

  //connect to game
  connectToPhaserRoom() {
    // debugger
    console.log('Connect to Phaser Room', this.modal.seatOnServer);
    this.client
      .consumeSeatReservation(this.modal.seatOnServer)
      .then((room: any) => {
        console.log('user joined game room successfully', room);
        this.modal.roomId = room.id;
        this.setRoomObject.next(room);
        this.modal.gameLoad = true;
        this.modal.networkConnected = true;
        this.modal.reconnectPopup = false;

        this.startGame(room);
      })
      .catch((err: any) => {
        console.error('consumeSeatReservation', err);
      });
  }

  //Initialize all the in game events
  startGame(room: any) {
    console.log('inside start game');
    this.modal.gameRoom = room;
    // this.modal.reconnectPopup = false;

    // save room id and session id for later reconnection
    localStorage.setItem('sessionId', room.sessionId);
    localStorage.setItem('roomId', room.id);

    console.log('inside start game');

    // on state event in game
    room.state.players.onAdd = (player: any, key: any) => {
      console.log(player, 'has been added at', key);
      console.log(
        'friends player>>>',
        player,
        player.coins,
        player,
        player.name
      );

      let map: { [key: string]: string } = {};
      map['playerName'] = player.name;
      map['playerId'] = key;
      map['itsMe'] = 'false';
      map['type'] = 'Random';
      map['userId'] = player.dbId;
      map['avatar'] = player.avatar;
      map['index'] = player.index;
      // map['direction'] = player.direction;
      console.log(
        player.dbId,
        'comparing',
        this.modal.userId,
        this.modal.userServerIndex,
        'inside room connect'
      );
      if (player.dbId == this.modal.userId) {
        map['itsMe'] = 'true';
        this.modal.teamName = player.team;
        this.modal.currentPlayerState = player;
        // console.log("updating room connect index ", key)
        this.modal.userServerIndex = player.index;

        console.log(
          'this.modal.currentPlayerState.cards',
          this.modal.currentPlayerState
        );

        map['chairId'] = '1';
      } else {
        map['chairId'] =
          (this.modal.userServerIndex + player.index) % 4
            ? (((this.modal.userServerIndex + player.index) % 4) + 1).toString()
            : '3';
        // map['chairId'] = (((this.modal.userServerIndex + player.index) % 4) + 1).toString();
        console.log(
          'seat in socket map',
          this.modal.userServerIndex,
          player.index,
          map['chairId']
        );
        // console.log('seat in socket map', map)
      }
      let anObj = {
        playerName: player.userName,
        index: player.index,
        team: player.team,
        userId: player.dbId,
        seat: map['chairId'],
        avatar: map['avatar'],
      };
      this.modal.allPlayers.push(anObj);
      console.log('seat in socket', this.modal.allPlayers);
      // console.log('checking cards',this.modal.userServerIndex,player.index)

      if (this.modal.userServerIndex == player.index) {
        console.log('matching', this.modal.userServerIndex, player.index);
        let self = this;
        // self.modal.cardDistibuted = true;
        console.log('cardLeft>>>', this.modal.cardLeft, self.modal.cardLeft);
        player.cards.onAdd = function (card: any) {
          console.log('card added in players hand>>>>', card);
          if (
            self.modal.userServerIndex == player.index &&
            !self.modal.cardDistibuted
          ) {
            let map: { [key: string]: string } = {};
            map['id'] = card.id;
            map['isActive'] = card.isActive;
            map['suit'] = card.suit;
            map['value'] = card.value;
            map['card'] = card.card;
            map['color'] = card.color;
            map['pointValue'] = card.pointValue;
            map['isWild'] = card.isWild;
            console.log('point value', card.pointValue);
            self.modal.cardNewArray.push(map);
            self.newCard.next(map);
          } else {
            self.playerCardAdded.next(card);
          }
        };

        player.cards.onRemove = (card: any) => {
          console.log(card, 'has been removed ');
          let map: { [key: string]: string } = {};
          map['id'] = card.id;
          map['suit'] = card.suit;
          map['value'] = card.value;
          map['card'] = card.card;
          map['pointValue'] = card.pointValue;
          map['isWild'] = card.isWild;
          // this.cardRemoved.push(map);
          this.cardRemoved.next(map);
          this.playerHandCardRemoved.next(card);
        };
      }
      // else{
      let self = this;
      player.onChange = function (changes: any) {
        console.log('Player change value>>', changes);
        changes.forEach((change: any) => {
          let map: { [key: string]: string } = {};

          console.log('Player change field>>', change.field);
          switch (change.field) {
            case 'name':
              map['playerIndex'] = player.index;
              map['playerName'] = change.value;
              console.log('player name>>', change.value);
              // self.modal.playerName = change.value;
              self.playerName.next(map);
              break;

            case 'avatar':
              map['playerIndex'] = player.index;
              map['avatar'] = change.value;
              console.log('player avatar', change.value);
              self.playerAvatar.next(map);
              break;

            case 'cardCount':
              let map3: { [key: string]: string } = {};
              map3['playerIndex'] = player.index;
              map3['cardCount'] = change.value;
              console.log('player cardCount', change.value, map3);
              self.modal.cardLeft = change.value;
              self.cardCount.next(map3);
              console.log('cards left>>', map3);
              break;

            case 'team':
              let map4: { [key: string]: string } = {};
              map4['team'] = change.value;
              console.log('team>>>>>>>>>>', map4);
              break;
          }
        });
      };
      // }
    };

    room.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        switch (change.field) {
          case 'status':
            console.log('status>>', change);
            this.currentGameStatus = change.value;

            if (this.currentGameStatus != 'GAMEPLAY') {
              this.modal.gameplay = false;
            } else {
              this.modal.gameplay = true;
            }

            if (this.currentGameStatus == 'WAITING') {
            }

            if (
              this.currentGameStatus == 'ROUND_OVER' ||
              this.currentGameStatus == 'GAME_OVER'
            ) {
              let myTeam = this.modal.teamName;
              let rivalTeam = this.modal.teamName == 'A' ? 'B' : 'A';
              this.modal.teamScore.status = this.currentGameStatus;
              this.modal.teamScore.myTeam = room.state.teamScore[myTeam];
              this.modal.teamScore.rivalsTeam = room.state.teamScore[rivalTeam];
              this.modal.teamScore.totalMyTeam =
                room.state.teamScore['total' + myTeam];
              this.modal.teamScore.totalRivalsTeam =
                room.state.teamScore['total' + rivalTeam];
              this.modal.teamScore.roundSummaryMyTeam = {
                finishedP:
                  room.state.teamScore['roundSummary' + myTeam].finishedP,
                handCardsP:
                  room.state.teamScore['roundSummary' + myTeam].handCardsP,
                meldedCardsP:
                  room.state.teamScore['roundSummary' + myTeam].meldedCardsP,
                naturalCanastasP:
                  room.state.teamScore['roundSummary' + myTeam]
                    .naturalCanastasP,
                mixedCanastasP:
                  room.state.teamScore['roundSummary' + myTeam].mixedCanastasP,
                acesCanastasP:
                  room.state.teamScore['roundSummary' + myTeam].acesCanastasP,
                sevensCanastasP:
                  room.state.teamScore['roundSummary' + myTeam].sevensCanastasP,
                wildsCanastasP:
                  room.state.teamScore['roundSummary' + myTeam].wildsCanastasP,
                specialCanastasP:
                  room.state.teamScore['roundSummary' + myTeam]
                    .specialCanastasP,
              };

              this.modal.teamScore.roundSummaryRivalsTeam = {
                finishedP:
                  room.state.teamScore['roundSummary' + rivalTeam].finishedP,
                handCardsP:
                  room.state.teamScore['roundSummary' + rivalTeam].handCardsP,
                meldedCardsP:
                  room.state.teamScore['roundSummary' + rivalTeam].meldedCardsP,
                naturalCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .naturalCanastasP,
                mixedCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .mixedCanastasP,
                acesCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .acesCanastasP,
                sevensCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .sevensCanastasP,
                wildsCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .wildsCanastasP,
                specialCanastasP:
                  room.state.teamScore['roundSummary' + rivalTeam]
                    .specialCanastasP,
              };
              this.modal.showResult = true;
              if (this.currentGameStatus == 'GAME_OVER') {
                this.gameOver.next(this.currentGameStatus);
              }

            }

            break;

          case 'turnIndex':
            let map: { [key: string]: string } = {};
            this.modal.playerIndex = change.value;
            map['playerIndex'] = change.value;
            map['seat'] = '0';
            for (let player of this.modal.allPlayers) {
              if (player.index == change.value) {
                map['seat'] = this.modal.currentTurnSeat = player.seat;
                break;
              }
            }
            console.log('playersinroom', map);
            this.startTimer.next(map);

            if (this.currentGameStatus == 'GAMEPLAY') {
              console.log('I am inside the current game', change.value);
              this.myPlayingTurn.next(change.value);
            }

            break;
          case 'currentTurnTimeLeft':
            this.timeLeft = Math.round(change.value / 1000);

            let seat = '0';
            for (let player of this.modal.allPlayers) {
              if (player.index == this.modal.playerIndex) {
                seat = this.modal.currentTurnSeat = player.seat;
                break;
              }
            }

            if (this.timeLeft >= 1) {
              this.gameTimer.next({ timeLeft: this.timeLeft, seat: seat });
              this.modal.firstDiscardCard = false;
            }

            break;

          case 'gameMode':
            this.modal.gameModeType = change.value;
            console.log('gameMode>>>>', this.modal.gameModeType);

            if (this.modal.gameModeType == 'newbie') {
              this.modal.gameTimer = 4;
            }
            if (this.modal.gameModeType == 'relaxed') {
              this.modal.gameTimer = 6;
            }
            if (this.modal.gameModeType == 'fast') {
              this.modal.gameTimer = 8;
            }
            if (this.modal.gameModeType == 'turbo') {
              this.modal.gameTimer = 12;
            }

            break;

          case 'minimumMeldPoints':
            console.log('min meld points>>', change.value);
            this.meldRequired.next(change.value);
            break;

          case 'round':
            console.log('round>>', change.value);
            let map2: { [key: string]: string } = {};
            map2['roundCount'] = change.value;
            map2['status'] = this.currentGameStatus;
            this.roundCount = change.value;
            this.Round.next(map2);
            break;
        }
      });
    };

    //// Add to stock Pile ////
    room.state.stockPile.onAdd = (card: any) => {
      console.log('stockPile', card);
      let map: { [key: string]: string } = {};
      map['id'] = card.id;
      map['value'] = card.value;
      map['card'] = card.card;
      map['isActive'] = card.isActive;
      map['color'] = card.color;
      map['suit'] = card.suit;
      map['pointValue'] = card.pointValue;
      map['isWild'] = card.isWild;

      // map['point'] = card.point;
      this.stockPile.next(map);
    };

    //// Remove from stock pile ////
    room.state.stockPile.onRemove = (card: any) => {
      console.log('Stockpile onRemove:', card);
      let map: { [key: string]: string } = {};
      map['id'] = card.id;
      map['value'] = card.value;
      map['card'] = card.card;
      map['isActive'] = card.isActive;
      map['color'] = card.color;
      map['suit'] = card.suit;
      map['pointValue'] = card.pointValue;
      map['isWild'] = card.isWild;
      this.modal.cardFromDeck = true; //// check
      console.log('OnRemove StockPile : ', map);
      // this.stockPile.next(map);
      this.stockPileRemoved.next(card);
    };
    room.state.discardPile.onAdd = (card: any) => {
      console.log('Discard card', card);
      // let map3: { [key: string]: string; } = {};
      // map3['id'] = card.id;
      // map3['value'] = card.value;
      // map3['card'] = card.card;
      // map3['isActive'] = card.isActive;
      // map3['color'] = card.color;
      // map3['suit'] = card.suit;
      // map3['pointValue'] = card.pointValue;
      // map3['isWild'] = card.isWild;
      // map3['_from'] = card._from;
      // map3['point'] = card.point;
      this.discardedPile.next(card);
    };
    room.state.discardPile.onRemove = (card: any) => {
      console.log('Discard card ON REMOVE', card);
      this.discardedPileRemoved.next(card);
    };

    //// Melds

    room.state.meldA.onAdd = (meldDataA: any) => {
      let isCanasta = false;
      let isPureCanasta = false;
      console.log('meldDataA Card:', meldDataA);
      meldDataA.cards.onAdd = (meldDataCard: any) => {
        let map1: { [key: string]: any } = {};
        map1['meldId'] = meldDataA.meldId;
        map1['teamName'] = meldDataA.team;
        map1['cardValue'] = meldDataA.cardValue;
        map1['id'] = meldDataCard.id;
        map1['value'] = meldDataCard.value;
        map1['card'] = meldDataCard.card;
        map1['color'] = meldDataCard.color;
        map1['pointValue'] = meldDataCard.pointValue;
        map1['isWild'] = meldDataCard.isWild;
        map1['isDrawFromDiscard'] = meldDataCard.isDrawFromDiscard;
        map1['isDrawFromStock'] = meldDataCard.isDrawFromStock;
        map1['_from'] = meldDataCard._from;
        map1['isCanasta'] = isCanasta;
        map1['isPureCanasta'] = isPureCanasta;

        // meldDataCard.onRemove = () => {
        //   console.log('Team A undo card',meldDataCard)
        //   meldCardARemoveAction(meldDataA, meldDataCard);
        // }
        console.log(
          'A Meld Card >>>>',
          meldDataA.team,
          this.modal.teamName,
          meldDataCard
        );
        this.meldDataA.next(map1);
      };

      meldDataA.onChange = (changes: any) => {
        console.log('meldDataA changes >>>>', changes);
        changes.forEach((change: any) => {
          switch (change.field) {
            case 'isCanasta':
              isCanasta = change.value;
              break;
            case 'isPureCanasta':
              isPureCanasta = change.value;
            // setTimeout(() => {
            //   this.meldCanastaUpdate.next({});
            // }, 3000)
            // break;
          }
        });

        setTimeout(() => {
          this.meldCanastaUpdate.next({
            team: 'A',
            cardValue: meldDataA.cardValue,
            isCanasta: meldDataA.isCanasta,
            isPureCanasta: meldDataA.isPureCanasta,
          });
          this.meldCanastaUpdate.next({});
        }, 2000);
      };

      meldDataA.cards.onRemove = (meldDataCard: any) => {
        console.log('Team A undo card', meldDataCard);
        meldCardARemoveAction(meldDataA, meldDataCard);
      };
    };

    room.state.meldA.onRemove = (meld: any) => {
      console.log('MMMMMMMM', meld);
      meld.cards.forEach((card: any) => {
        meldCardARemoveAction(meld, card);
      });
    };

    const meldCardARemoveAction = (meldDataA: any, meldDataCard: any) => {
      let map1: { [key: string]: string } = {};
      map1['meldId'] = meldDataA.meldId;
      map1['teamName'] = meldDataA.team;
      map1['cardValue'] = meldDataA.cardValue;
      map1['id'] = meldDataCard.id;
      map1['value'] = meldDataCard.value;
      map1['card'] = meldDataCard.card;
      map1['color'] = meldDataCard.color;
      map1['pointValue'] = meldDataCard.pointValue;
      map1['isWild'] = meldDataCard.isWild;
      map1['isDrawFromDiscard'] = meldDataCard.isDrawFromDiscard;
      map1['isDrawFromStock'] = meldDataCard.isDrawFromStock;
      map1['referenceMeldValue'] = meldDataCard.referenceMeldValue;
      map1['_from'] = meldDataCard._from;
      console.log(
        ' undo A Meld Card >>>>',
        meldDataCard.team,
        this.modal.teamName,
        meldDataCard
      );
      this.undoMeldA.next(map1);
    };
    room.state.meldB.onAdd = (meldDataB: any) => {
      console.log('meldDataB Card:', meldDataB);
      let isCanasta = false;
      let isPureCanasta = false;

      meldDataB.cards.onAdd = (meldDataCard: any) => {
        let map: { [key: string]: any } = {};
        map['meldId'] = meldDataB.meldId;
        map['teamName'] = meldDataB.team;
        map['cardValue'] = meldDataB.cardValue;
        map['id'] = meldDataCard.id;
        map['value'] = meldDataCard.value;
        map['card'] = meldDataCard.card;
        map['color'] = meldDataCard.color;
        map['pointValue'] = meldDataCard.pointValue;
        map['isWild'] = meldDataCard.isWild;
        map['isDrawFromDiscard'] = meldDataCard.isDrawFromDiscard;
        map['isDrawFromStock'] = meldDataCard.isDrawFromStock;
        map['_from'] = meldDataCard._from;
        map['isCanasta'] = isCanasta;
        map['isPureCanasta'] = isPureCanasta;

        console.log(
          'Undo B Meld Card >>>>',
          meldDataB.team,
          this.modal.teamName,
          meldDataCard
        );
        this.meldDataB.next(map);
      };

      meldDataB.onChange = (changes: any) => {
        console.log('meldDataB changes >>>>', changes);
        changes.forEach((change: any) => {
          switch (change.field) {
            case 'isCanasta':
              isCanasta = change.value;

              break;
            case 'isPureCanasta':
              isPureCanasta = change.value;
              break;
          }
        });

        setTimeout(() => {
          this.meldCanastaUpdate.next({
            team: 'B',
            cardValue: meldDataB.cardValue,
            isCanasta: meldDataB.isCanasta,
            isPureCanasta: meldDataB.isPureCanasta,
          });
        }, 3000);
      };

      meldDataB.cards.onRemove = (meldDataCard: any) => {
        console.log('Team B undo card', meldDataCard);
        meldCardBRemoveAction(meldDataB, meldDataCard);
      };
    };

    room.state.meldB.onRemove = (meld: any) => {
      console.log('MMMMMMMM B', meld);
      meld.cards.forEach((card: any) => {
        meldCardBRemoveAction(meld, card);
      });
    };

    const meldCardBRemoveAction = (meldDataB: any, meldDataCard: any) => {
      let map1: { [key: string]: string } = {};
      map1['meldId'] = meldDataB.meldId;
      map1['teamName'] = meldDataB.team;
      map1['cardValue'] = meldDataB.cardValue;
      map1['id'] = meldDataCard.id;
      map1['value'] = meldDataCard.value;
      map1['card'] = meldDataCard.card;
      map1['color'] = meldDataCard.color;
      map1['pointValue'] = meldDataCard.pointValue;
      map1['isWild'] = meldDataCard.isWild;
      map1['isDrawFromDiscard'] = meldDataCard.isDrawFromDiscard;
      map1['isDrawFromStock'] = meldDataCard.isDrawFromStock;
      map1['referenceMeldValue'] = meldDataCard.referenceMeldValue;
      map1['_from'] = meldDataCard._from;

      console.log(' undo A Meld Card >>>>', map1, meldDataCard);
      this.undoMeldB.next(map1);
    };

    room.state.teamScore.onChange = (changes: any) => {
      console.log(
        'score changes >>>>',
        room.state.teamScore,
        room.state.teamScore.roundSummaryA
      );
      changes.forEach((change: any) => {
        switch (change.field) {
          case 'A':
            console.log('team A score update', change.value);
            this.pointsUpdateA.next(change.value);

            break;

          case 'B':
            console.log('team B score update', change.value);
            this.pointsUpdateB.next(change.value);
            break;

          case 'minimumMeldTeamA':
            console.log('team A minimum meld update', change.value);
            this.minimumMeldTeamA.next(change.value);
            break;

          case 'minimumMeldTeamB':
            console.log('team B minimum meld update', change.value);
            this.minimumMeldTeamB.next(change.value);
            break;

          case 'winningTeam':
            console.log('winning team', change.value);
            this.winningTeam = change.value;
            this.winnerTeam.next(change.value);
            break;

          case 'totalA':
            console.log('commulative score', change.value);
            this.commulativeScoreA.next(change.value);
            break;

          case 'totalB':
            console.log('commulative score', change.value);
            this.commulativeScoreB.next(change.value);
            break;
        }
      });
    };
    room.onError((code: any, message: any) => {
      console.log('oops, error ocurred:', code);
      // this.modal.errorOccured = true;
      this.modal.meldHistory = [];
      this.modal.showErrorMessage = true;
      this.modal.message = message;
      console.log('server error message>>', this.modal.message);
      setTimeout(() => {
        this.modal.showErrorMessage = false;
      }, 5000);
    });

    room.onMessage(
      'CHAT_RECEIVED',
      (message: { playerIndex: string; data: any }) => {
        console.log('CHAT_RECEIVED', message);
        this.chatData.next({
          playerIndex: message.playerIndex,
          data: message.data,
        });
      }
    );

    room.onMessage('ANIM_DISCARD_TO_HANDS', (message: any) => {
      console.log('ANIM_DISCARD_TO_HANDS', message);
      let map: { [key: string]: string } = {};
      map['type'] = 'ANIM_DISCARD_TO_HANDS';
      map['playerIndex'] = message.playerIndex;
      map['team'] = message.team;
      map['cards'] = message.cards;

      this.playAnimation.next(map);
    });

    room.onLeave((code: any, message: any) => {
      console.info(
        room.sessionId,
        'left the game room ',
        room.name,
        code,
        message
      );
      if (code != 1000) {
        // room.removeAllListeners();
        // this.tryReconnection();
      } else {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('roomId');
        localStorage.removeItem('userObj');
      }
    });
  }

  tryReconnection = (): boolean => {
    let _sessionId = localStorage.getItem('sessionId');
    let _roomId = localStorage.getItem('roomId');
    // let _userObj = localStorage.getItem('userObj');

    let localData = this.localDb.getSessionData();

    // let userObj: any;

    // try {
    //   userObj = _userObj ? JSON.parse(_userObj) : false;
    // } catch (e) {
    //   console.error(e);
    // }

    if (_roomId && _sessionId && localData?.userId) {
      console.info('success', 'Reconnecting game to the server.');

      if (!this.client) {
        this.client = new Client(this.port);
      }

      this.client
        .reconnect(_roomId, _sessionId)
        .then((room: any) => {
          this.modal.gameRoom = room;
          this.modal.roomId = room.id;
          this.modal.userId = localData?.userId;
          this.setRoomObject.next(room);

          this.startGame(room);

          console.log('room ', room, room.state.toJSON(), room.state.turnIndex);
          // room.onMessage("STATE_LOADED", (message: any) => {
          //   console.info("STATE_LOADED", room.state.toJSON(), message)
          //   this.restoreState.next({"notEmpty":"yes"});
          //   this.startGame(room);
          // })

          let interval = setTimeout(() => {
            console.log(
              'after ',
              room,
              room.state.toJSON(),
              room.state.turnIndex
            );
            // if (room.state.turnIndex !== undefined) {

            // let map: { [key: string]: string } = {};
            // map['playerIndex'] = room.state.turnIndex;
            //   map['seat'] = '0';
            //   for (let player of this.modal.allPlayers) {
            //     if (player.index == room.state.turnIndex) {
            //       map['seat'] = this.modal.currentTurnSeat = player.seat;
            //       break;
            //     }
            //   }
            //   console.info("MMMMMMMMMMMMm",map)
            this.restoreState.next({ notEmpty: 'yes' });

            this.modal.networkConnected = true;

            // this.startTimer.next(map);
            // this.gameTimer.next({ timeLeft: Math.round(room.state.currentTurnTimeLeft / 1000), seat: map['seat'] });
            // clearInterval( interval);
            // }
          }, 5000);
          console.info('success', 'Reconnected successfully.');
        })
        .catch((error: any) => {
          console.info('error', 'Reconnection failed, Match over!');
          this.modal.isReconnect = false;
          console.log('RECONNECT ERROR', error);
          localStorage.removeItem('sessionId');
          localStorage.removeItem('roomId');
          localStorage.removeItem('userObj');

          this.leaveGame.next({ foo: 'bae' });
          // this.router.navigate(['/landing', {}]);

          // joinOrCreateRoom();
          // hideGame()
        });

      return true;
    } else {
      console.info('No _roomId or _sessionId found');
      this.router.navigateByUrl('/gameplay', { skipLocationChange: false });

      // joinOrCreateRoom();
      // hideGame()

      this.leaveGame.next({ foo: 'bae' });
      // this.gameComponent.leaveGame()

      // this.router.navigate(['/landing', {}]);

      return false;
    }
  };
}
