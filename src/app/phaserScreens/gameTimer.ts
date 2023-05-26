import { Table } from './table';
export class GameTimer extends Phaser.Scene {
  graphics: any;
  radius: any;
  posX: any;
  posY: any;
  timerDuration: any;
  model: any;
  socketsvc: any;
  gameComp: any;
  current: any;
  previous: any;
  showTimer: boolean = false;
  num: any;
  player1Highlighter: any;
  player2Highlighter: any;
  player3Highlighter: any;
  player4Highlighter: any;
  flag: boolean = false;
  timer_runout: any;
  table: any;
  currenSound: any;

  constructor(
    handle: any,
    rad: any,
    posX: any,
    posY: any,
    time: any,
    num: any,
    model: any,
    socketsvc: any,
    gameComp: any,
    table: Table
  ) {
    super(handle);
    this.radius = rad;
    this.timerDuration = time;
    this.model = model;
    // this.num = num;
    console.log('game timer constructor');
    this.socketsvc = socketsvc;
    this.gameComp = gameComp;
    this.posX = posX;
    this.posY = posY;
    this.table = table;
  }

  create() {
    this.graphics = this.add.graphics();
    this.subscriberTimerServices();
    // this.timer_runout = this.sound.add('timer-runout');

    // this.player2Highlighter = this.add.image((this.game.scale.width / 12.5) * 5.7,this.game.scale.height / 7, 'turnHighlighter').setOrigin(0.5,0.5);
    this.player2Highlighter = this.add
      .image(this.table.player2.x, this.table.player2.y, 'turnHighlighter')
      .setOrigin(0.5, 0.5);
    this.player2Highlighter.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.width / 20
    );
    this.player2Highlighter.visible = false;

    this.player3Highlighter = this.add
      .image(
        this.game.scale.width / 11,
        this.game.scale.height / 4.5,
        'turnHighlighter'
      )
      .setOrigin(0.5, 0.5);
    this.player3Highlighter.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.width / 20
    );
    this.player3Highlighter.visible = false;

    this.player4Highlighter = this.add
      .image(
        this.game.scale.width / 1.1,
        this.game.scale.height / 4.5,
        'turnHighlighter'
      )
      .setOrigin(0.5, 0.5);
    this.player4Highlighter.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.width / 20
    );
    this.player4Highlighter.visible = false;

    this.player1Highlighter = this.add.image(
      this.table.player1.x,
      this.table.player1.y,
      'turnHighlighter'
    );
    this.player1Highlighter.setDisplaySize(
      this.game.scale.width / 20,
      this.game.scale.width / 20
    );
    this.player1Highlighter.visible = false;
    // console.log("this.table.player1.x", this.table.player1.x, this.player1Highlighter.x);

    this.tweens.add({
      targets: [
        this.player1Highlighter,
        this.player2Highlighter,
        this.player3Highlighter,
        this.player4Highlighter,
      ],
      alpha: 0.3,
      ease: 'linear',
      duration: 500,
      repeat: -1,
      yoyo: true,
    });
  }

  playSound(audioType: any) {
    console.log('play_sound', audioType, this.model.sound);
    console.log('check_Sound', this.sound.get(audioType));
    if (this.model.sound) {
      if (!this.sound.get(audioType)) {
        this.currenSound = this.sound.add(audioType);
      } else {
        this.currenSound.stop();
        this.currenSound = this.sound.get(audioType);
      }
      this.currenSound.play();
    }
  }

  subscriberTimerServices() {
    let temp = this.socketsvc.gameTimer.subscribe((data: any) => {
      // console.log('The value of the subscribed timer is',data);
      // console.log('game timer',this.model.gameTimer)
      if (JSON.stringify(data) != '{}' && data.timeLeft) {
        this.graphics.clear();
        this.graphics.lineStyle(13, 0x0bf800);
        this.graphics.beginPath();
        this.graphics.arc(
          this.posX,
          this.posY,
          this.radius,
          Phaser.Math.DegToRad(0),
          Phaser.Math.DegToRad(360 - data.timeLeft * this.model.gameTimer),
          true
        );
        this.graphics.strokePath();

        // if(this.highlightTween){
        //     this.highlightTween.stop();
        // }

        switch (data.seat) {
          case '1':
            if (data.timeLeft < 9) {
              this.playSound('timer-runout');
            }
            this.player1Highlighter.visible = true;
            this.player2Highlighter.visible = false;
            this.player3Highlighter.visible = false;
            this.player4Highlighter.visible = false;

            this.player1Highlighter.x = this.table.player1.x;

            // this.showHilighter(data,this.player1Highlighter);
            //   }, 1000);

            break;

          case '3':
            this.player1Highlighter.visible = false;
            this.player2Highlighter.visible = true;
            this.player3Highlighter.visible = false;
            this.player4Highlighter.visible = false;

            this.player2Highlighter.x = this.table.player2.x;
            // this.showHilighter(data,this.player2Highlighter);

            break;
          case '2':
            this.player1Highlighter.visible = false;
            this.player2Highlighter.visible = false;
            this.player3Highlighter.visible = true;
            this.player4Highlighter.visible = false;

            this.player3Highlighter.x = this.table.player3.x;

            // this.showHilighter(data,this.player3Highlighter);

            break;
          case '4':
            this.player1Highlighter.visible = false;
            this.player2Highlighter.visible = false;
            this.player3Highlighter.visible = false;
            this.player4Highlighter.visible = true;

            this.player4Highlighter.x = this.table.player4.x;
            // this.showHilighter(data,this.player4Highlighter);

            break;
        }
      }
    });

    this.model.subscribeTimer = temp;
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  showHilighter(data: any, player: any) {
    this.player1Highlighter.visible = false;
    this.player2Highlighter.visible = false;
    this.player3Highlighter.visible = false;
    this.player4Highlighter.visible = false;

    player.visible = true;
    // if (data == 0) {
    //     console.log('no flash')
    //     return;
    // }
    // else {
    //     player.visible = true
    //     //   setTimeout(() => {
    //     //       console.log('flash', player.visible)
    //     //       player.visible = false
    //     //       // this.flag = false;
    //     //   }, 500);

    // }
  }
}
