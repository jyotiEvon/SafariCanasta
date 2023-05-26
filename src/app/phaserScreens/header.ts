export class Header extends Phaser.Scene {
  gameComp: any;
  hangBoard1: any;
  hangBoard2: any;
  hangBoardText1: any;
  hangBoardText2: any;
  settings: any;
  box: any;
  opponent1: any;
  score1: any;
  score2: any;

  player1: any;
  timer: any;
  player1Text: any;
  socketScv: any;
  model: any;
  myTeamScore: any;
  teamPoints1: any;
  teamPoints2: any;
  player1CardsLeft: any;
  cumulativeScoreLeft: any;
  cumulativeScoreRight: any;
  cumulativeScoreRightText: any;
  cumulativeScoreLeftText: any;
  CardsLeft: any;
  player2CardsLeft: any;
  player3CardsLeft: any;
  player4CardsLeft: any;

  constructor(key: string, gameComp: any, socket: any, model: any) {
    super(key);
    this.gameComp = gameComp;
    this.socketScv = socket;
    this.model = model;
  }

  create() {
    //static Assets
    this.hangBoard1 = this.add
      .image(this.game.scale.width / 4.5, -45, 'hangboard')
      .setOrigin(0.5, 0.5);
    this.hangBoard1.setDisplaySize(
      this.game.scale.width / 7,
      this.game.scale.height / 8
    );

    this.hangBoard2 = this.add
      .image(this.game.scale.width / 1.3, -45, 'hangboard')
      .setOrigin(0.5, 0.5);
    this.hangBoard2.setDisplaySize(
      this.game.scale.width / 7,
      this.game.scale.height / 8
    );

    this.hangBoardText1 = this.add
      .text(this.game.scale.width / 5.1, -45, 'RIVALS', {
        fontSize: '16px',
        fontFamily: 'Taz-UltraBlack',
        color: '#ffffff',
      })
      .setOrigin(0, 0.2)
      .setShadow(0, 3, '#00000099', 4, false, true);
    this.hangBoardText1.setFontSize(this.game.scale.width / 250 + 'ex');

    this.hangBoardText2 = this.add
      .text((this.game.scale.width / 4.7) * 3.4, -45, 'OUR TEAM', {
        font: '16px Taz-UltraBlack',
        shadow: { offsetY: 2, blur: 6 },
        color: '#ffffff',
      })
      .setOrigin(0, 0.2)
      .setShadow(0, 3, '#00000099', 4, false, true);
    this.hangBoardText2.setFontSize(this.game.scale.width / 250 + 'ex');

    this.box = this.add
      .image(this.game.scale.width / 2.2, 0, 'box')
      .setOrigin(0.5, 0.5);
    this.box.setDisplaySize(
      this.game.scale.width / 12,
      this.game.scale.height / 8.3
    );

    this.opponent1 = this.add
      .image(this.game.scale.width / 1.9, 0, 'opponentcard1')
      .setOrigin(0.5, 0.5);
    this.opponent1.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.29
    );
    this.opponent1.setDepth(10000);

    this.score1 = this.add
      .text(
        (this.game.scale.width / 6) * 0.75,
        this.game.scale.height / 10,
        'Score: ',
        { font: '4px Roboto-Light', color: '#ffffff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.score1.setFontSize(this.game.scale.width / 350 + 'ex');

    this.teamPoints1 = this.add
      .text(
        (this.game.scale.width / 85) * 10.6 + this.score1.width,
        this.game.scale.height / 10,
        '0',
        { font: '14px Roboto-Bold', color: '#fff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.teamPoints1.setFontSize(this.game.scale.width / 350 + 'ex');

    this.cumulativeScoreLeft = this.add
      .text(
        (this.game.scale.width / 6) * 1.55,
        this.game.scale.height / 10,
        'Cumulative Score:',
        { font: '16px Roboto-Light', color: '#ffffff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.cumulativeScoreLeft.setFontSize(this.game.scale.width / 350 + 'ex');

    this.cumulativeScoreLeftText = this.add
      .text(
        (this.game.scale.width / 16) * 5.4 + this.score1.width,
        this.game.scale.height / 10,
        '00',
        { font: '16px Roboto-Bold', color: '#fff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.cumulativeScoreLeftText.setFontSize(
      this.game.scale.width / 350 + 'ex'
    );

    this.score2 = this.add
      .text(
        (this.game.scale.width / 8) * 4.37,
        this.game.scale.height / 10,
        'Score: ',
        { font: '16px Roboto-Light', color: '#ffffff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.score2.setFontSize(this.game.scale.width / 350 + 'ex');

    this.teamPoints2 = this.add
      .text(
        (this.game.scale.width / 14.5) * 7.92 + this.score2.width,
        this.game.scale.height / 10,
        '0',
        { font: '16px Roboto-Bold', color: '#fff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.teamPoints2.setFontSize(this.game.scale.width / 350 + 'ex');

    this.cumulativeScoreRight = this.add
      .text(
        (this.game.scale.width / 7.5) * 5.2,
        this.game.scale.height / 10,
        'Cumulative Score:',
        { font: '14px Roboto-Light', color: '#ffffff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.cumulativeScoreRight.setFontSize(this.game.scale.width / 350 + 'ex');

    this.cumulativeScoreRightText = this.add
      .text(
        (this.game.scale.width / 12) * 9.25 + this.score2.width,
        this.game.scale.height / 10,
        '00',
        { font: '16px Roboto-Bold', color: '#fff' }
      )
      .setOrigin(0, 0.5)
      .setShadow(0, 1, '#00000099', 3, false, true);
    this.cumulativeScoreRightText.setFontSize(
      this.game.scale.width / 350 + 'ex'
    );

    // this.bluecircle.setDisplaySize((this.game.scale.width / 40) * 1.5,(this.game.scale.width / 40) * 1.5)

    // this.player1 = this.add.image((this.game.scale.width / 12.5) * 6.2, this.game.scale.height / 9.2, 'player').setOrigin(0.5, 0.5)
    // this.player1.setDisplaySize(0, 0)
    // this.player1.setDisplaySize((this.game.scale.width / 40) * 1.3,(this.game.scale.width / 40) * 1.3)

    // this.player1Text = this.add.text(((this.game.scale.width / 8.8) * 4.2), (this.game.scale.height / 6.2), "Shairly", { font: 'Bold 25px Arial', color: '#ffffff', }).setOrigin(0, 0.5);
    // this.player1Text.setFontSize((this.game.scale.width / 400) + 'ex');

    this.playAnimation();
    this.subscribeToServices();
    // this.cardLeftInPlayersHand();
  }
  playAnimation() {
    let self = this;
    let hangBordTween = self.tweens.add({
      targets: [self.hangBoard1, self.hangBoard2],
      y: this.game.scale.height / 68.6,
      // scale: 0,
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 800,
      yoyo: false,
      onComplete(cardTween) {
        cardTween.stop();
      },
    });
    let hangBordTextTween = self.tweens.add({
      targets: [self.hangBoardText1, self.hangBoardText2],
      y: this.game.scale.height / 45,
      // scale: 0,
      ease: 'Elastic',
      easeParams: [0, 1.5],
      duration: 800,
      yoyo: false,
      onComplete(hangBordTextTween) {
        hangBordTextTween.stop();
      },
    });

    let opponent1Tween = self.tweens.add({
      targets: [self.opponent1, self.box],
      y: this.game.scale.height / 550,
      ease: 'linear',
      duration: 200,
      yoyo: false,
      onComplete(opponent1Tween) {
        opponent1Tween.stop();
      },
    });

    // let blueCircleTween = self.tweens.add({
    //     targets: [self.bluecircle],
    //     ease: 'linear',
    //     duration: 200,
    //     scale: (this.game.scale.width / 4000),
    //     yoyo: false,
    //     onComplete(blueCircleTween) {
    //         blueCircleTween.stop();
    //     }
    // });

    let playerTween = self.tweens.add({
      targets: [self.player1],
      ease: 'linear',
      duration: 200,
      scale: this.game.scale.width / 4000,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });
    let player1CardLeftTween = self.tweens.add({
      targets: [self.player1CardsLeft, self.CardsLeft],
      ease: 'linear',
      duration: 200,
      y: (this.game.scale.height / 80) * 2.5,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });
  }

  subscribeToServices() {
    //Team Score
    this.subscribeToTeamAPoints();
    this.subscribeToTeamBPoints();

    //cumulative score
    this.subscribeToTeamAComulativePoints();
    this.subscribeToTeamBComulativePoints();
  }

  subscribeToTeamAPoints() {
    let temp = this.socketScv.pointsUpdateA.subscribe((data: any) => {
      if (JSON.stringify(data) != '{}') {
        console.log('myTeamScores AAAA>>', data);
        this.myTeamScore = data;
        if (this.model.teamName == 'A') {
          this.teamPoints2.text = data;
        } else {
          this.teamPoints1.text = data;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
  subscribeToTeamBPoints() {
    let temp = this.socketScv.pointsUpdateB.subscribe((data: any) => {
      if (JSON.stringify(data) != '{}') {
        console.log('myTeamScores BBBB>> ', data);
        this.myTeamScore = data;
        if (this.model.teamName == 'B') {
          this.teamPoints2.text = data;
        } else {
          this.teamPoints1.text = data;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToTeamAComulativePoints() {
    let temp = this.socketScv.commulativeScoreA.subscribe((data: any) => {
      if (JSON.stringify(data) != '{}') {
        console.log('myTeamComulativeScores AAAA>>', data);
        this.myTeamScore = data;
        if (this.model.teamName == 'A') {
          this.cumulativeScoreRightText.text = data;
        } else {
          this.cumulativeScoreLeftText.text = data;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
  //Number.isInteger(data)
  subscribeToTeamBComulativePoints() {
    let temp = this.socketScv.commulativeScoreB.subscribe((data: any) => {
      if (JSON.stringify(data) != '{}') {
        console.log('myTeamComulativeScores BBBB>> ', data);
        this.myTeamScore = data;
        if (this.model.teamName == 'B') {
          this.cumulativeScoreRightText.text = data;
        } else {
          this.cumulativeScoreLeftText.text = data;
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }
}
