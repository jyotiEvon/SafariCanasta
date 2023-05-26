import { Injectable } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';
import { Cards } from './cards';
import { Header } from './header';
import { Table } from './table';
// import { TestCards } from "./testCard";

import { SoundService } from '../services/sound.service';

@Injectable()
export class GameScreen extends Phaser.Scene {
  gameComponent: any;
  socketConnection: any;
  background: any;
  gameBoard: any;
  currentScene: any;
  progressBar: any;
  timerEvent: any;
  constructor(
    private socket: SocketconnectionServices,
    public model: ModelLocater,
    public sounds: SoundService
  ) {
    super({ key: 'GameScreen' });
    console.log('the game screen');
  }
  ngAfterViewInit() {
    // this.progressBar = document.getElementsByClassName('progress-value') as HTMLCollectionOf<HTMLElement>
  }
  preload() {
    // background
    let self = this;
    this.load.on('progress', function (value: any) {
      console.log('PROGRESS', value);
      self.model.showPhaserProgressBar = true;
      self.model.phaserProgressValue = value;
    });

    this.load.on('fileprogress', function (file: any) {
      console.log('LOADING FILE', file.src);
    });
    this.load.on('complete', function () {
      console.log('PHASER LOAD COMPLETE');
      self.model.showPhaserProgressBar = false;
    });

    this.load.image('background', 'assets/GameAssets/Background.jpg');
    this.load.image('board', 'assets/GameAssets/Board.png');
    this.load.image('hangboard', 'assets/GameAssets/hang-board.png');
    this.load.image('settings', 'assets/GameAssets/Settings.png');
    this.load.image('box', 'assets/GameAssets/box.png');
    this.load.image(
      'opponentcard1',
      'assets/GameAssets/Oppoents cards 1 copy.png'
    );
    this.load.image('bluecircle', 'assets/GameAssets/Blue circle.png');
    this.load.image('player', 'assets/GameAssets/profile pic.png');
    this.load.image('redcircle', 'assets/GameAssets/red circle.png');
    this.load.image('timer', 'assets/GameAssets/Timer 1.png');
    this.load.image(
      'opponentcard2',
      'assets/GameAssets/Oppoents cards 1 copy.png'
    );
    this.load.image('deck', 'assets/GameAssets/Deck of cards 1.png');
    this.load.image('undo', 'assets/GameAssets/undo.png');
    this.load.image('bg', 'assets/GameAssets/bg.png');
    this.load.image('special', 'assets/GameAssets/Special.png');

    this.load.image('emptyPile', 'assets/GameAssets/empty pile.png');
    this.load.image('rectangleBox', 'assets/GameAssets/Rectangle 5.png');
    this.load.image(
      'turnHighlighter',
      'assets/GameAssets/Turn Highlighter.png'
    );

    this.load.image('deckHighlighter', 'assets/GameAssets/glow deck of cards 1.png');



    //cards
    this.load.image('1', 'assets/Cards/2 diamonds.png');
    this.load.image('2', 'assets/Cards/3 diamonds.png');
    this.load.image('3', 'assets/Cards/4 diamonds.png');
    this.load.image('4', 'assets/Cards/5 diamonds.png');
    this.load.image('5', 'assets/Cards/6 diamonds.png');
    this.load.image('6', 'assets/Cards/7 diamonds.png');
    this.load.image('7', 'assets/Cards/8 diamonds.png');
    this.load.image('8', 'assets/Cards/9 diamonds.png');
    this.load.image('9', 'assets/Cards/10 diamonds.png');
    this.load.image('13', 'assets/Cards/A diamonds.png');
    this.load.image('10', 'assets/Cards/J diamonds.png');
    this.load.image('12', 'assets/Cards/K diamonds.png');
    this.load.image('11', 'assets/Cards/Q diamonds.png');

    this.load.image('14', 'assets/Cards/2 clubs.png');
    this.load.image('15', 'assets/Cards/3 clubs.png');
    this.load.image('16', 'assets/Cards/4 clubs.png');
    this.load.image('17', 'assets/Cards/5 clubs.png');
    this.load.image('18', 'assets/Cards/6 clubs.png');
    this.load.image('19', 'assets/Cards/7 clubs.png');
    this.load.image('20', 'assets/Cards/8 clubs.png');
    this.load.image('21', 'assets/Cards/9 clubs.png');
    this.load.image('22', 'assets/Cards/10 clubs.png');
    this.load.image('26', 'assets/Cards/A clubs.png');
    this.load.image('23', 'assets/Cards/J clubs.png');
    this.load.image('25', 'assets/Cards/K clubs.png');
    this.load.image('24', 'assets/Cards/Q clubs.png');

    this.load.image('27', 'assets/Cards/2 hearts.png');
    this.load.image('28', 'assets/Cards/3 hearts.png');
    this.load.image('29', 'assets/Cards/4 hearts.png');
    this.load.image('30', 'assets/Cards/5 hearts.png');
    this.load.image('31', 'assets/Cards/6 hearts.png');
    this.load.image('32', 'assets/Cards/7 hearts.png');
    this.load.image('33', 'assets/Cards/8 hearts.png');
    this.load.image('34', 'assets/Cards/9 hearts.png');
    this.load.image('35', 'assets/Cards/10 hearts.png');
    this.load.image('39', 'assets/Cards/A hearts.png');
    this.load.image('36', 'assets/Cards/J hearts.png');
    this.load.image('38', 'assets/Cards/K hearts.png');
    this.load.image('37', 'assets/Cards/Q hearts.png');

    this.load.image('40', 'assets/Cards/2 spades.png');
    this.load.image('41', 'assets/Cards/3 spades.png');
    this.load.image('42', 'assets/Cards/4 spades.png');
    this.load.image('43', 'assets/Cards/5 spades.png');
    this.load.image('44', 'assets/Cards/6 spades.png');
    this.load.image('45', 'assets/Cards/7 spades.png');
    this.load.image('46', 'assets/Cards/8 spades.png');
    this.load.image('47', 'assets/Cards/9 spades.png');
    this.load.image('48', 'assets/Cards/10 spades.png');
    this.load.image('52', 'assets/Cards/A spades.png');
    this.load.image('49', 'assets/Cards/J spades.png');
    this.load.image('51', 'assets/Cards/K spades.png');
    this.load.image('50', 'assets/Cards/Q spades.png');
    this.load.image('53', 'assets/Cards/Joker joker.png');

    this.load.image('54', 'assets/Cards/Joker joker.png');

    this.load.image('55', 'assets/Cards/2 diamonds.png');
    this.load.image('56', 'assets/Cards/3 diamonds.png');
    this.load.image('57', 'assets/Cards/4 diamonds.png');
    this.load.image('58', 'assets/Cards/5 diamonds.png');
    this.load.image('59', 'assets/Cards/6 diamonds.png');
    this.load.image('60', 'assets/Cards/7 diamonds.png');
    this.load.image('61', 'assets/Cards/8 diamonds.png');
    this.load.image('62', 'assets/Cards/9 diamonds.png');
    this.load.image('63', 'assets/Cards/10 diamonds.png');
    this.load.image('64', 'assets/Cards/J diamonds.png');
    this.load.image('65', 'assets/Cards/Q diamonds.png');
    this.load.image('66', 'assets/Cards/K diamonds.png');
    this.load.image('67', 'assets/Cards/A diamonds.png');

    this.load.image('68', 'assets/Cards/2 clubs.png');
    this.load.image('69', 'assets/Cards/3 clubs.png');
    this.load.image('70', 'assets/Cards/4 clubs.png');
    this.load.image('71', 'assets/Cards/5 clubs.png');
    this.load.image('72', 'assets/Cards/6 clubs.png');
    this.load.image('73', 'assets/Cards/7 clubs.png');
    this.load.image('74', 'assets/Cards/8 clubs.png');
    this.load.image('75', 'assets/Cards/9 clubs.png');
    this.load.image('76', 'assets/Cards/10 clubs.png');
    this.load.image('77', 'assets/Cards/J clubs.png');
    this.load.image('78', 'assets/Cards/Q clubs.png');
    this.load.image('79', 'assets/Cards/K clubs.png');
    this.load.image('80', 'assets/Cards/A clubs.png');

    this.load.image('81', 'assets/Cards/2 hearts.png');
    this.load.image('82', 'assets/Cards/3 hearts.png');
    this.load.image('83', 'assets/Cards/4 hearts.png');
    this.load.image('84', 'assets/Cards/5 hearts.png');
    this.load.image('85', 'assets/Cards/6 hearts.png');
    this.load.image('86', 'assets/Cards/7 hearts.png');
    this.load.image('87', 'assets/Cards/8 hearts.png');
    this.load.image('88', 'assets/Cards/9 hearts.png');
    this.load.image('89', 'assets/Cards/10 hearts.png');
    this.load.image('90', 'assets/Cards/J hearts.png');
    this.load.image('91', 'assets/Cards/Q hearts.png');
    this.load.image('92', 'assets/Cards/K hearts.png');
    this.load.image('93', 'assets/Cards/A hearts.png');

    this.load.image('94', 'assets/Cards/2 spades.png');
    this.load.image('95', 'assets/Cards/3 spades.png');
    this.load.image('96', 'assets/Cards/4 spades.png');
    this.load.image('97', 'assets/Cards/5 spades.png');
    this.load.image('98', 'assets/Cards/6 spades.png');
    this.load.image('99', 'assets/Cards/7 spades.png');
    this.load.image('100', 'assets/Cards/8 spades.png');
    this.load.image('101', 'assets/Cards/9 spades.png');
    this.load.image('102', 'assets/Cards/10 spades.png');
    this.load.image('103', 'assets/Cards/J spades.png');
    this.load.image('104', 'assets/Cards/Q spades.png');
    this.load.image('105', 'assets/Cards/K spades.png');
    this.load.image('106', 'assets/Cards/A spades.png');

    this.load.image('107', 'assets/Cards/Joker joker.png');
    this.load.image('108', 'assets/Cards/Joker joker.png');


    //Load Avatars

    this.load.image('crocodile', 'assets/img/users/crocodile.png');
    this.load.image('elephant', 'assets/img/users/elephant.png');
    this.load.image('giraffe', 'assets/img/users/giraffe.png');
    this.load.image('gorilla', 'assets/img/users/gorilla.png');
    this.load.image('lion', 'assets/img/users/lion.png');
    this.load.image('ostrich', 'assets/img/users/ostrich.png');
    this.load.image('rhino', 'assets/img/users/rhino.png');
    this.load.image('s', 'assets/img/users/s.png');

    //Load audio
    this.load.audio('addition-meld', 'assets/Audio/addition-meld.wav');
    this.load.audio('automatic-bonus', 'assets/Audio/automatic-bonus.mp3');
    this.load.audio('bg-Music', 'assets/Audio/bg-Music.mp3');
    this.load.audio('btn-sound', 'assets/Audio/btn-sound.mp3');
    this.load.audio(
      'Canasta-Completion',
      'assets/Audio/Canasta-Completion-Sound.mp3'
    );
    this.load.audio('card-add-new', 'assets/Audio/card-add-new.mp3');
    this.load.audio('card-add', 'assets/Audio/card-add.mp3');
    this.load.audio('card-draw-discard', 'assets/Audio/card-draw-discard.wav');
    this.load.audio(
      'card-flip-sound',
      'assets/Audio/Card-flip-sound-effect.mp3'
    );
    this.load.audio('card-turn-effect', 'assets/Audio/card-turn-effect 1.wav');
    this.load.audio('dealing-card', 'assets/Audio/dealing-card.wav');
    this.load.audio('dealt-card', 'assets/Audio/dealt-card.mp3');
    this.load.audio('elephant-trumpet', 'assets/Audio/elephant trumpet.mp3');
    this.load.audio('shuffling-cards', 'assets/Audio/shuffling-cards.wav');
    this.load.audio('timer-runout', 'assets/Audio/timer-runout.wav');
  }

  create() {
    ////////Loading Phaser Screens & Game////////////
    this.subscribeToRestorePhaser();

    this.background = this.add
      .image(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        'background'
      )
      .setOrigin(0.5, 0.5);
    this.background.setDisplaySize(
      this.game.scale.width,
      this.game.scale.height
    );

    this.gameBoard = this.add
      .image(this.game.scale.width / 2, this.game.scale.height / 2.18, 'board')
      .setOrigin(0.5, 0.5);
    this.gameBoard.setDisplaySize(
      this.game.scale.width / 1.3,
      this.game.scale.height / 1.5
    );
    //Loading Header
    this.loadHeader('Header');

    //Loading Table
    this.loadTable('Table');

    //loading Cards
    this.loadCards('Card');

    // initialize
    this.initializeGame();
    // this.model.gameRoom.send('PHASER_LOADED');
  }

  loadHeader(key: any) {
    // let key = key;
    let header = new Header(key, this.gameComponent, this.socket, this.model);
    this.scene.add(key, header, true);
  }

  loadTable(key: any) {
    // let key = 'Table';
    let table = new Table(key, this.gameComponent, this.socket, this.model);
    this.scene.add(key, table, true);
  }

  loadCards(key: any) {
    // let key = 'Card';
    let card = new Cards(key, this.gameComponent, this.socket, this.model);
    this.scene.add(key, card, true);
  }

  // loadCards(){
  //     let key = 'Card';
  //     let card = new TestCards(key,this.gameComponent,this.socket, this.model);
  //     this.scene.add(key,card,true)
  // }

  // loadCards(){
  //     let key = 'Card';
  //     let card = new StaticCards(key,this.gameComponent,this.socket, this.model);
  //     this.scene.add(key,card,true)

  // }
  initializeGame() {
    console.log('inside initializeGame');
    this.gameComponent.startGame();
  }
  subscribeToRestorePhaser() {
    let temp = this.socket.restorePhaser.subscribe((data: any) => {
      console.log('subscribeToRestorePhaser', data);
      if (JSON.stringify(data) != '{}') {
        this.updateGameScreen();
      }
    });
    // this.gameComp.gamePlaySubscriptions.push(temp);
  }
  updateGameScreen() {
    console.log(
      'updateGameScreen',
      this.model.gameLoad,
      this.model.isReconnect,
      this.model.networkStatus
    );

    for (let subs of this.gameComponent.gamePlaySubscriptions) {
      subs.unsubscribe();
    }
    // console.log('currentScene',this.scene, this.scene.restart())

    this.game.scene.remove('Header');
    this.game.scene.remove('Table');
    this.game.scene.remove('Card');
    this.game.scene.remove('TurnHighlighter1');
    this.game.registry.destroy();
    this.game.events.off('progress');
    this.game.events.off('fileprogress');
    this.game.events.off('complete');
    this.scene.restart();
  }

  // }
}
