import { GameComponent } from '../game/game.component';
import { GameTimer } from './gameTimer';
export class Table extends Phaser.Scene {
  gameComp: any;
  redcircle2: any;
  redcircle3: any;
  redcircle4: any;
  timer: any;
  player2: any;
  player3: any;
  opponent2: any;
  opponent3: any;
  box2: any;
  box3: any;
  special: any;
  bg: any;
  staticTimer: any;
  initialMeldRequired: any;
  player2Name: any;
  player3Name: any;
  player2CardsLeft: any;

  player4: any;
  specialTxt: any;
  socketScv: any;
  model: any;
  player4Name: any;
  CardsLeft: any;
  player3CardsLeft: any;
  CardsLeft2: any;
  player4CardsLeft: any;
  CardsLeft3: any;
  CardsLeft4: any;
  player1: any;
  player1Name: any;

  bluecircle: any;
  bluecircle1: any;

  constructor(key: string, gameComp: any, socket: any, model: any) {
    super(key);
    this.gameComp = gameComp;
    this.socketScv = socket;
    this.model = model;
  }

  create() {
    //static assets

    // player 2

    // this.bluecircle = this.add.image((this.game.scale.width / 12.5) * 5.7, this.game.scale.height / 7, 'bluecircle').setOrigin(0.5, 0.5)
    // this.bluecircle.setDisplaySize(0, 0);
    // this.bluecircle.setDepth(20)

    // this.player2 = this.add.image((this.game.scale.width / 12.5) * 5.7, this.game.scale.height / 7, 'player').setOrigin(0.5, 0.5)
    // this.player2.setDisplaySize(0, 0);
    // this.player2.setDepth(20);
    // this.player2Name = this.add.text((this.game.scale.width / 12.5) * 6.3, (this.game.scale.height / 6.5), "player 2", { font: '16px Roboto-bold', color: '#ffffff', }).setOrigin(0.5, 0.5);
    // this.player2Name.setFontSize((this.game.scale.width / 400) + 'ex');

    this.bluecircle = this.add
      .image(0, this.game.scale.height / 7, 'bluecircle')
      .setOrigin(0.5, 0.5)
      .setDepth(20)
      .setDisplaySize(0, 0);
    // this.player2Group.add(this.bluecircle);

    this.player2 = this.add
      .image(0, this.game.scale.height / 7, 'player')
      .setOrigin(0.5, 0.5)
      .setDepth(20)
      .setDisplaySize(0, 0);
    // this.player2Group.add(this.player2)

    this.player2Name = this.add
      .text(0, this.game.scale.height / 7, 'waiting...', {
        font: '16px Roboto-bold',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5)
      .setDisplaySize(0, 0);

    this.player2Name
      .setFontSize(this.game.scale.width / 400 + 'ex')
      .setShadow(0, 1, '#00000099', 3, false, true);
    // this.player2Group.add(this.player2Name)

    this.setPlayer2Position();
    // this.player2Group.incXY(this.game.scale.width/2 - (_w/2), this.game.scale.height / 7)

    // PLAYER 3

    this.redcircle2 = this.add
      .image(
        this.game.scale.width / 11,
        this.game.scale.height / 4.5,
        'redcircle'
      )
      .setOrigin(0.5, 0.5);
    this.redcircle2.setDisplaySize(0, 0);
    this.redcircle2.setDepth(20);

    this.player3 = this.add
      .image(this.game.scale.width / 11, this.game.scale.height / 4.5, 'player')
      .setOrigin(0.5, 0.5);
    this.player3.setDisplaySize(0, 0);
    this.player3.setDepth(20);

    // this.player3Name = this.add.text((this.game.scale.width / 28) * 1.78, this.game.scale.height / 3.5, "Yanni Soni", { font: '16px Roboto-bold', color: '#ffffff', }).setOrigin(0, 0.5);
    this.player3Name = this.add
      .text(
        this.game.scale.width / 11,
        this.game.scale.height / 3.5,
        'waiting...',
        {
          font: '16px Roboto-bold',
          color: '#ffffff',
        }
      )
      .setOrigin(0.5, 0.5)
      .setDisplaySize(0, 0);
    this.player3Name
      .setFontSize(this.game.scale.width / 400 + 'ex')
      .setShadow(0, 1, '#00000099', 3, false, true);

    this.staticTimer = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 4,
        'timer'
      )
      .setOrigin(0.5, 0.5);
    this.staticTimer.setDisplaySize(0, 0);

    //player 4
    this.redcircle3 = this.add
      .image(
        this.game.scale.width / 1.1,
        this.game.scale.height / 4.5,
        'redcircle'
      )
      .setOrigin(0.5, 0.5);
    this.redcircle3.setDisplaySize(0, 0);
    this.redcircle3.setDepth(20);

    this.player4 = this.add
      .image(
        this.game.scale.width / 1.1,
        this.game.scale.height / 4.5,
        'player'
      )
      .setOrigin(0.5, 0.5);

    this.player4.setDisplaySize(0, 0);
    this.player4.setDepth(20);

    // this.player4Name = this.add.text((this.game.scale.width / 5) * 4.45, this.game.scale.height / 3.5, "player 4", { font: '16px Roboto-bold', color: '#ffffff', }).setOrigin(0, 0.5);
    this.player4Name = this.add
      .text(
        this.game.scale.width / 1.1,
        this.game.scale.height / 3.5,
        'waiting...',
        { font: '16px Roboto-bold', color: '#ffffff' }
      )
      .setOrigin(0.5, 0.5);
    this.player4Name
      .setFontSize(this.game.scale.width / 400 + 'ex')
      .setShadow(0, 1, '#00000099', 3, false, true);

    this.opponent2 = this.add.image(
      0,
      this.game.scale.height / 2.3,
      'opponentcard2'
    );
    this.opponent2.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    this.opponent2.setDepth(10000);

    this.box2 = this.add
      .image(0, this.game.scale.height / 1.7, 'box')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.box2.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.height / 8
    );

    this.opponent3 = this.add.image(
      this.game.scale.width / 1,
      this.game.scale.height / 2.3,
      'opponentcard2'
    );
    this.opponent3.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    this.opponent3.setDepth(10000);

    this.box3 = this.add
      .image(this.game.scale.width / 1, this.game.scale.height / 1.7, 'box')
      .setOrigin(0.5, 0.5);
    this.box3.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.height / 8
    );

    // player 1

    // this.bluecircle1 = this.add.image((this.game.scale.width / 12.5) * 5.7,  (this.game.scale.height / 6.5)*4.95, 'bluecircle').setOrigin(0.5, 0.5)
    // this.bluecircle1.setDisplaySize(0, 0);
    // this.bluecircle1.setDepth(20)

    // this.redcircle4 = this.add.image((this.game.scale.width / 12.5) * 5.7, (this.game.scale.height / 6.5)*4.95, "redcircle").setOrigin(0.5, 0.5)
    // this.redcircle4.setDisplaySize(0, 0)

    // this.player1 = this.add.image((this.game.scale.width / 12.5) * 5.7, (this.game.scale.height / 6.5)*4.95, 'player').setOrigin(0.5, 0.5)
    // this.player1.setDisplaySize(0, 0)
    // this.player1Name = this.add.text((this.game.scale.width / 12.5) * 6.2, (this.game.scale.height / 6.5)*4.95, "You", { font: '16px Roboto-bold', color: '#ffffff', }).setOrigin(0, 0.5);
    // this.player1Name.setFontSize((this.game.scale.width / 400) + 'ex');

    this.bluecircle1 = this.add
      .image(0, (this.game.scale.height / 6.5) * 4.95, 'bluecircle')
      .setOrigin(0.5, 0.5)
      .setDepth(20)
      .setDisplaySize(0, 0);

    this.player1 = this.add
      .image(0, (this.game.scale.height / 6.5) * 4.95, 'player')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(0, 0);

    this.player1Name = this.add
      .text(0, (this.game.scale.height / 6.5) * 4.95, 'You', {
        font: '16px Roboto-bold',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5)
      .setDisplaySize(0, 0);
    this.player1Name
      .setFontSize(this.game.scale.width / 400 + 'ex')
      .setShadow(0, 1, '#00000099', 3, false, true);

    this.setPlayer1Position();

    // _w = this.player1Name.width + (this.game.scale.width / 4000)/ 2 +10;
    // this.player1Group.incXY((this.game.scale.width / 2) - (_w/2), ((this.game.scale.height / 6.5) * 4.95))

    this.bg = this.add
      .image(this.game.scale.width / 3.4, this.game.scale.height / 4.6, 'bg')
      .setOrigin(0.5, 0.5);
    this.bg.setDisplaySize(
      (this.game.scale.width / 40) * 10,
      (this.game.scale.width / 40) * 3
    );
    this.bg.alpha = 0.2;

    this.special = this.add
      .image(0, this.game.scale.height / 1.3, 'special')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.special.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    this.special.on('pointerdown', () => {
      console.log('SPECIAL_HAND');
      this.model.gameRoom.send('SPECIAL_HAND');
    });
    this.specialTxt = this.add
      .text(
        this.game.scale.width / 95,
        this.game.scale.height / 1.3,
        'Special',
        { font: '40px Roboto-Bold', color: '#ffffff' }
      )
      .setOrigin(0.5, 0.5);
    this.specialTxt.setFontSize(this.game.scale.width / 300 + 'ex');
    this.specialTxt.angle = 270;

    this.initialMeldRequired = this.add
      .text(
        (this.game.scale.width / 9) * 4.52,
        (this.game.scale.height / 8) * 5.5,
        'Meld Required: 00',
        { font: '14px Roboto-Bold', color: '#ffffff' }
      )
      .setOrigin(0.5, 0.5);
    this.initialMeldRequired
      .setFontSize(this.game.scale.width / 450 + 'ex')
      .setShadow(0, 1, '#00000099', 3, false, true);

    this.player2CardsLeft = this.add
      .text(this.game.scale.width / 2.3, 0, '13', {
        font: '20px Roboto-Bold',
        color: '#6bd96d',
      })
      .setOrigin(0.5, 0.5);
    this.player2CardsLeft.setFontSize(this.game.scale.width / 250 + 'ex');

    this.CardsLeft2 = this.add
      .text((this.game.scale.width / 5.3) * 2.48, 0, 'Left', {
        font: '20px Roboto-Bold',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5);
    this.CardsLeft2.setFontSize(this.game.scale.width / 400 + 'ex');

    this.player3CardsLeft = this.add
      .text(0, this.game.scale.height / 1.77, '13', {
        font: '20px Roboto-Bold',
        color: '#6bd96d',
      })
      .setOrigin(0.5, 0.5);
    this.player3CardsLeft.setFontSize(this.game.scale.width / 250 + 'ex');

    this.CardsLeft3 = this.add
      .text(0, (this.game.scale.height / 4.2) * 2.56, 'Left', {
        font: '20px Roboto-Bold',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5);
    this.CardsLeft3.setFontSize(this.game.scale.width / 450 + 'ex');

    this.player4CardsLeft = this.add
      .text(this.game.scale.width / 1, this.game.scale.height / 1.77, '13', {
        font: '20px Roboto-Bold',
        color: '#6bd96d',
      })
      .setOrigin(0.5, 0.5);
    this.player4CardsLeft.setFontSize(this.game.scale.width / 250 + 'ex');

    this.CardsLeft4 = this.add
      .text(
        this.game.scale.width / 1,
        (this.game.scale.height / 4.2) * 2.56,
        'Left',
        { font: '20px Roboto-Bold', color: '#ffffff' }
      )
      .setOrigin(0.5, 0.5);
    this.CardsLeft4.setFontSize(this.game.scale.width / 450 + 'ex');

    let timer = new GameTimer(
      'TurnHighlighter1',
      (this.game.scale.width / 95) * 2.2,
      (this.game.scale.width / 12.5) * 6.3,
      this.game.scale.height / 4,
      10000,
      1,
      this.model,
      this.socketScv,
      this.gameComp,
      this
    );
    this.scene.add('TurnHighlighter1', timer, true);

    this.playAnimation();

    this.subscribeToServices();
  }

  setPlayer2Position() {
    let _w = this.player2Name.width + this.game.scale.width / 4000 / 2 + 15;
    this.player2.x = this.game.scale.width / 2 - _w / 2;
    this.bluecircle.x = this.game.scale.width / 2 - _w / 2;

    _w = this.player2.x + (136 * (this.game.scale.width / 4000)) / 2 + 13;
    this.player2Name.x = _w;
  }

  setPlayer1Position() {
    let _w = this.player1Name.width + this.game.scale.width / 4000 / 2 + 10;
    this.player1.x = this.game.scale.width / 2 - _w / 2;
    this.bluecircle1.x = this.game.scale.width / 2 - _w / 2;

    _w = this.player1.x + (136 * (this.game.scale.width / 4000)) / 2 + 13;
    this.player1Name.x = _w;
  }

  subscribeToServices() {
    this.subscribeToGameTimer();
    this.subscribeToInitialMeldPointsTeamA();
    this.subscribeToInitialMeldPointsTeamB();
    this.subscribeToCardCount();
    this.subscribeToPlayerName();
    this.subscribeToAvatar();
  }

  playAnimation() {
    let self = this;
    let blueCircleTween = self.tweens.add({
      targets: [self.bluecircle, self.bluecircle1],
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 1000,
      scale: this.game.scale.width / 4000,
      yoyo: false,
      onComplete(blueCircleTween) {
        blueCircleTween.stop();
      },
    });

    let redCircleTween = self.tweens.add({
      targets: [self.redcircle2, self.redcircle3],
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 1000,
      // width:this.game.scale.width/90,
      // height:this.game.scale.width/90,
      scale: this.game.scale.width / 4000,
      yoyo: false,
      onComplete(redCircleTween) {
        redCircleTween.stop();
        console.log('inside tween');
        // self.redcircle2.setDisplaySize(self.game.scale.height/12.8,self.game.scale.height/12.8)
        // self.redcircle3.setDisplaySize(self.game.scale.height/12.8,self.game.scale.height/12.8)
      },
    });

    let playerTween = self.tweens.add({
      targets: [self.player1],
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 1000,
      scale: this.game.scale.width / 4000,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });

    let playerNameTween = self.tweens.add({
      targets: [
        self.player1Name,
        self.player2Name,
        self.player3Name,
        self.player4Name,
      ],
      ease: 'linear',
      duration: 400,
      scale: 1,
      yoyo: false,
      onComplete(playerNameTween) {
        playerNameTween.stop();
      },
    });

    let playerTween2 = self.tweens.add({
      targets: [self.player2, self.player3, self.player4],
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 1000,
      scale: this.game.scale.width / 4000,
      yoyo: false,
      onComplete(playerTween) {
        playerTween2.stop();
      },
    });

    let timerTween = self.tweens.add({
      targets: [self.staticTimer],
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 1000,
      scale: this.game.scale.width / 3000,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });

    let opponent1Tween = self.tweens.add({
      targets: [self.opponent2, self.box2],
      x: this.game.scale.width / 70,
      ease: 'linear',
      duration: 400,
      yoyo: false,
      onComplete(opponent1Tween) {
        opponent1Tween.stop();
      },
    });

    let opponent2Tween = self.tweens.add({
      targets: [self.opponent3, self.box3],
      x: this.game.scale.width / 1.02,
      ease: 'linear',
      duration: 400,
      yoyo: false,
      onComplete(opponent1Tween) {
        opponent2Tween.stop();
      },
    });

    let specialButtonTween = self.tweens.add({
      targets: [self.special],
      x: this.game.scale.width / 95,
      ease: 'linear',
      duration: 400,
      yoyo: false,
      onComplete(specialButtonTween) {
        specialButtonTween.stop();
      },
    });
    let player1CardLeftTween = self.tweens.add({
      targets: [self.player2CardsLeft, self.CardsLeft2],
      ease: 'linear',
      duration: 400,
      y: (this.game.scale.height / 80) * 2.5,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });

    let cardLeftTween = self.tweens.add({
      targets: [self.player3CardsLeft, self.CardsLeft3],
      x: (this.game.scale.width / 600) * 12.5,
      ease: 'linear',
      duration: 400,
      yoyo: false,
      onComplete(cardLeftTween) {
        cardLeftTween.stop();
      },
    });

    let cardLeft2Tween = self.tweens.add({
      targets: [self.player4CardsLeft, self.CardsLeft4],
      x: (this.game.scale.width / 30) * 29.2,
      ease: 'linear',
      duration: 400,
      yoyo: false,
      onComplete(cardLeft2Tween) {
        cardLeft2Tween.stop();
      },
    });
  }
  subscribeToGameTimer() {
    let temp = this.socketScv.startTimer.subscribe((data: any) => {
      console.log('turndata', data);

      if (JSON.stringify(data) != '{}') {
        switch (data.seat) {
          case '1':
            this.loadTimer(this.player1, '1');

            break;
          case '3':
            this.loadTimer(this.player2, '2');

            break;
          case '2':
            this.loadTimer(this.player3, '3');

            break;
          case '4':
            this.loadTimer(this.player4, '4');

            break;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToInitialMeldPointsTeamA() {
    let temp = this.socketScv.minimumMeldTeamA.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        console.log('initial meld points A', data);
        if (this.model.teamName == 'A') {
          this.initialMeldRequired.text = `Meld Required :${data}`;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToInitialMeldPointsTeamB() {
    let temp = this.socketScv.minimumMeldTeamB.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        console.log('initial meld points B', data);
        if (this.model.teamName == 'B') {
          this.initialMeldRequired.text = `Meld Required :${data}`;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
  subscribeToPlayerName() {
    let temp = this.socketScv.playerName.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        console.log('player info', data);
        this.displayPlayerName(data);
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToAvatar() {
    let temp = this.socketScv.playerAvatar.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        console.log('player avatar', data);
        this.displayAvatar(data);
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
  subscribeToCardCount() {
    let temp = this.socketScv.cardCount.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        console.log('player info', data);
        this.cardLeftInPlayersHand(data);
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
  // (this.game.scale.width / 12.5) * 6.3, this.game.scale.height / 4
  loadTimer(player: any, num: any) {
    console.log('inside loadTimer');
    let key = 'GameTimer';
    if (this.scene.isActive('GameTimer')) {
      this.scene.remove('GameTimer');
      this.model.subscribeTimer.unsubscribe();
    }
    // if(num  == '1'){
    // this.timer = new GameTimer(key, (this.game.scale.width / 95) * 2.2, (this.game.scale.width / 12.5) * 6.3, this.game.scale.height / 4, 10000,num, this.model, this.socketScv, this.gameComp)

    // }
    // else{
    //     this.timer = new GameTimer(key, (this.game.scale.width / 95) * 2, player.x, player.y, 10000, num,this.model, this.socketScv, this.gameComp)

    // }
    // this.scene.add(key, this.timer, true);
  }

  cardLeftInPlayersHand(data: any) {
    let seat = '0';
    for (let currentPlayer of this.model.allPlayers) {
      console.log(
        'current player index',
        currentPlayer.index,
        data.playerIndex
      );
      if (currentPlayer.index == data.playerIndex) {
        seat = currentPlayer.seat;
        console.log('players seat', seat);
        break;
      }
    }

    switch (seat.toString()) {
      case '1':
        console.log('my card count', data.cardCount);

        break;

      case '3':
        console.log('my Team mate turn', data.cardCount);
        this.player2CardsLeft.text = data.cardCount;

        break;

      case '2':
        console.log('Player 3 turn', data.cardCount);
        this.player3CardsLeft.text = data.cardCount;
        break;
      case '4':
        console.log('player 4 turn', data.cardCount);
        this.player4CardsLeft.text = data.cardCount;
        break;
    }
  }

  displayPlayerName(data: any) {
    let seat = '0';
    for (let currentPlayer of this.model.allPlayers) {
      console.log(
        'current player index',
        currentPlayer.index,
        data.playerIndex
      );
      if (currentPlayer.index == data.playerIndex) {
        seat = currentPlayer.seat;
        console.log('players seat', seat);
        break;
      }
    }
    //    debugger
    let _w;
    switch (seat.toString()) {
      case '1':
        console.log('my card count');
        this.player1Name.text = 'You';
        this.setPlayer1Position();

        break;

      case '3':
        console.log('my Team mate turn');
        this.player2Name.text = data.playerName;
        console.log('seat 2 player', this.player2Name.text);
        this.setPlayer2Position();
        break;

      case '2':
        console.log('Player 3 turn');
        this.player3Name.text = data.playerName;
        console.log('seat 3 player', this.player3Name.text);
        break;
      case '4':
        console.log('player 4 turn');
        this.player4Name.text = data.playerName;
        console.log('seat 4 player', this.player4Name.text);
        break;
    }
  }

  displayAvatar(data: any) {
    let seat = '0';
    for (let currentPlayer of this.model.allPlayers) {
      console.log(
        'current player index',
        currentPlayer.index,
        data.playerIndex
      );

      if (currentPlayer.index == data.playerIndex) {
        seat = currentPlayer.seat;
        console.log('players seat', seat);
        break;
      }
    }

    let avatar, _w, _h;
    switch (seat.toString()) {
      case '1':
        console.log('my card count');
        // this.player1Name.text = 'You';
        avatar = this.getPlayerAvatar(data.avatar);
        _w = this.player1.displayWidth;
        _h = this.player1.displayHeight;
        this.player1.destroy();
        this.player1 = this.add
          .image(0, (this.game.scale.height / 6.5) * 4.95, avatar)
          .setOrigin(0.5, 0.5)
          .setDisplaySize(_w, _h);
        // this.animatePlayerProfile(this.player1,this.bluecircle1);
        this.setPlayer1Position();

        break;

      case '3':
        console.log('my Team mate turn');
        // this.player2Name.text = data.playerName;
        // console.log('seat 2 player', this.player2Name.text);
        avatar = this.getPlayerAvatar(data.avatar);
        console.log('_avatar', avatar);
        _w = this.player2.displayWidth;
        _h = this.player2.displayHeight;
        this.player2.destroy();

        this.player2 = this.add
          .image(0, this.game.scale.height / 7, avatar)
          .setOrigin(0.5, 0.5)
          .setDisplaySize(_w, _h);
        this.setPlayer2Position();

        // this.animatePlayerProfile(this.player2,this.bluecircle);

        break;

      case '2':
        console.log('Player 3 turn');
        avatar = this.getPlayerAvatar(data.avatar);
        console.log('_avatar', avatar);
        this.player3.destroy();
        this.player3 = this.add
          .image(
            this.game.scale.width / 11,
            this.game.scale.height / 4.5,
            avatar
          )
          .setOrigin(0.5, 0.5);
        this.player3.setDisplaySize(
          this.game.scale.height / 12.8,
          this.game.scale.height / 12.8
        );

        // this.animatePlayerProfile(this.player3,this.redcircle2);

        break;
      case '4':
        console.log('seat 4 player', this.player4Name.text);
        avatar = this.getPlayerAvatar(data.avatar);
        console.log('_avatar', avatar);
        this.player4.destroy();

        this.player4 = this.add
          .image(
            this.game.scale.width / 1.1,
            this.game.scale.height / 4.5,
            avatar
          )
          .setOrigin(0.5, 0.5);

        this.player4.setDisplaySize(
          this.game.scale.height / 12.8,
          this.game.scale.height / 12.8
        );
        // this.animatePlayerProfile(this.player4,this.redcircle3);

        break;
    }
  }

  getPlayerAvatar(data: any) {
    // debugger;
    switch (data) {
      case '/assets/img/users/crocodile.png':
        return 'crocodile';
      case '/assets/img/users/elephant.png':
        return 'elephant';

      case '/assets/img/users/giraffe.png':
        return 'giraffe';

      case '/assets/img/users/gorilla.png':
        return 'gorilla';

      case '/assets/img/users/lion.png':
        return 'lion';

      case '/assets/img/users/ostrich.png':
        return 'ostrich';

      case '/assets/img/users/rhino.png':
        return 'rhino';

      default:
        return 's';
    }
  }

  animatePlayerProfile(player: any, circle: any) {
    let self = this;
    let avatarTween = self.tweens.add({
      targets: [player],
      ease: 'linear',
      duration: 200,
      // scale: this.game.scale.width / 12000,
      // width: this.game.scale.width / 90,
      // heigth: this.game.scale.width / 90,
      yoyo: false,
      onComplete(avatarTween) {
        avatarTween.stop();
      },
    });

    let circleTween = self.tweens.add({
      targets: [circle],
      ease: 'linear',
      duration: 200,
      // width: this.game.scale.width / 90,
      // heigth: this.game.scale.width / 90,
      yoyo: false,
      onComplete(circleTween) {
        circleTween.stop();
      },
    });
  }
}
