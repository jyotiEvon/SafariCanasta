export class Cards extends Phaser.Scene {
  gameComp: any;
  socketScv: any;
  modal: any;
  discardPile: any;
  stockPile: any;
  myCards: any = [];
  stockCardArray: any = [];
  discardedCardArray: any = [];
  myPlayingTurn: any = true;
  deckCardPicked: boolean = false;
  undo: any;
  card: any;
  cardsArray: any = [];
  cardpicked: boolean = false;
  dragObj: any;
  selectedMeld: any = [];
  meldRowArray: any = [];
  meldCard: any;
  discardedCard: any;
  lastPickedCard: any;
  teamAMeldCard: any = [];
  teamBMeldCard: any = [];
  meldArrayCordinates: any = [[]];
  rightMeldCordinates: any = Array(9).fill(Array(2).fill(0));
  leftMeldCordinates: any = Array(9).fill(Array(2).fill(0));
  specialCardsMeldA: any = Array(4).fill(Array(2).fill(0));
  specialCardsMeldB: any = Array(4).fill(Array(2).fill(0));
  meldboard: any;
  specialCardMeldBoard: any;
  discardedCardPicked: boolean = false;
  discardArray: any = [];
  pickCardPosX: any;
  pickCardPosY: any;
  arrangeCardsTimeout: any;
  _delayForArrangeCard = 0;
  stockPileCount: any;
  gamesound: any;
  discardSound: any;
  addition_meld: any;
  automatic_bonus: any;
  bg_Music: any;
  btn_sound: any;
  Canasta_Completion: any;
  card_add_new: any;
  card_add: any;
  card_draw_discard: any;
  card_flip_sound: any;
  card_turn_effect: any;
  dealing_card: any;
  dealt_card: any;
  elephant_trumpet: any;
  shuffling_cards: any;
  timer_runout: any;
  emptyStockPile: any;
  currenSound: any;
  gameSound: any;
  stockPileHighlighter: any;
  discardPileHighlighter: any;
  // meldHistory:any = [];

  constructor(key: any, gameComp: any, socket: any, modal: any) {
    super(key);
    this.gameComp = gameComp;
    this.socketScv = socket;
    this.modal = modal;
  }

  create() {
    // STOCK PILE
    // this.showOtherPlayerCards()

    this.stockPile = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 2.5,
        'deck'
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.stockPile.scaleX = 0;
    this.stockPile.scaleY = 0;

    this.stockPileHighlighter = this.add
      .image(this.stockPile.x, this.stockPile.y, 'deckHighlighter')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.stockPileHighlighter.setDisplaySize(
      this.game.scale.width / 13.5,
      this.game.scale.height / 9
    );
    this.stockPileHighlighter.visible = false;

    // DISCARD PILE
    this.discardPile = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 1.9,
        'emptyPile'
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.discardPile.scaleX = 0;
    this.discardPile.scaleY = 0;

    this.discardPileHighlighter = this.add
      .image(this.discardPile.x, this.discardPile.y, 'deckHighlighter')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.discardPileHighlighter.setDisplaySize(
      this.game.scale.width / 14.5,
      this.game.scale.height / 10.6
    );
    this.discardPileHighlighter.visible = false;

    if(this.discardPileHighlighter.visible || this.stockPileHighlighter.visible){
      this.tweens.add({
        targets: [this.stockPileHighlighter, this.discardPile],
        alpha: 0,
        ease: 'linear',
        duration: 500,
        repeat: -1,
        yoyo: true,
      });
    }
  

    let self = this;
    this.stockPile.on('pointerdown', () => {
      console.log(
        'stockpile pointer down',
        this.myPlayingTurn,
        !this.deckCardPicked
      );
      this.stockPileClickAction();
    });

    this.discardPile.on('pointerdown', () => {
      this.discardPileClickAction();
    });

    this.undo = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 1.6,
        'undo'
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    // this.undo.setDisplaySize((this.game.scale.width / 40) * 2.6, (this.game.scale.width / 40) * 1);
    this.undo.scaleX = 0;
    this.undo.scaleY = 0;

    this.undo.on('pointerdown', () => {
      console.log('undo card pointer down');
      if (this.myPlayingTurn) {
        console.log('Undo my move');
        this.modal.gameRoom.send('UNDO', {});
      }
    });

    this.stockPileCount = this.add
      .text(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 3,
        '',
        { font: '16px Roboto-light', color: '#ffffff' }
      )
      .setOrigin(0.5, 0.5);
    this.stockPileCount.setFontSize(this.game.scale.width / 400 + 'ex');
    this.playTween();
    this.showMyMelds();
    this.calcRightMeldBoardCordinates();
    this.calcLeftMeldBoardCordinates();
    this.subscribeToServices();
    this.specialCardMeld();
  }

  playSound(audioType: any) {
    console.log('play_sound', audioType, this.modal.sound);
    console.log('check_Sound', this.sound.get(audioType));
    if (this.modal.gameSoundSetting) {
      if (!this.sound.get(audioType)) {
        this.currenSound = this.sound.add(audioType);
      } else {
        this.currenSound.stop();
        this.currenSound = this.sound.get(audioType);
      }
      this.currenSound.play();
    }
  }

  stopSound(audio: any) {
    audio.stop();
  }

  playTween() {
    let self = this;
    let playerTween = self.tweens.add({
      targets: [self.discardPile, self.stockPile],
      ease: 'linear',
      duration: 200,
      scaleX: this.game.scale.width / 3500,
      scaleY: this.game.scale.width / 3900,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });

    let undoTween = self.tweens.add({
      targets: [self.undo],
      ease: 'linear',
      duration: 200,
      scaleX: this.game.scale.width / 1500,
      scaleY: this.game.scale.width / 1500,
      yoyo: false,
      onComplete(playerTween) {
        playerTween.stop();
      },
    });
  }
  subscribeToServices() {
    this.subscribeToPlayersCard();
    this.subscribeToStockPile();
    this.subscribeToDiscardedCard();
    this.subscribeToMyTurnToPlay();
    this.subscribeTeamAMeld();
    this.subscribeTeamBMeld();
    this.subscribeToUndoTeamAMeld();
    this.subscribeToUndoTeamBMeld();
    this.subscribeToCardOnRemove();
    this.subscribeToAnimation();
    // this.subscribeToOpponentMeld();
    this.subscribeToWinningTeam();
    this.subscribeToRoundOver();
    this.subscribeToGameOver();
    this.subscribeToCanastaUpdate();
    this.subscribeToRestoreState();
  }

  calcRightMeldBoardCordinates() {
    console.log('inside calc cord');
    for (let i = 0; i < 9; i++) {
      this.rightMeldCordinates[i] = [];
      for (let j = 0; j < 2; j++) {
        if (j == 0) {
          // let cal = ((this.game.scale.width / 1.65) + (i * 90));
          let cal = (this.game.scale.width / 132) * (79 + 4 * i);
          this.rightMeldCordinates[i][j] = cal;
        } else if (j == 1) {
          this.rightMeldCordinates[i][j] =
            (this.game.scale.height / 36.5) * 13.8;
        }
      }
    }
  }
  calcLeftMeldBoardCordinates() {
    for (let i = 0; i < 9; i++) {
      this.leftMeldCordinates[i] = [];
      for (let j = 0; j < 2; j++) {
        if (j == 0) {
          let cal = (this.game.scale.width / 135) * (23 + 4 * i);
          this.leftMeldCordinates[i][j] = cal;
        } else if (j == 1) {
          this.leftMeldCordinates[i][j] =
            (this.game.scale.height / 36.5) * 13.8;
        }
      }
    }
  }
  specialCardMeld() {
    //OUR SPECIAL MELD COORDINATES
    for (let i = 0; i < 4; i++) {
      // this.specialCardsMeldA[i] = [];
      let x = (this.game.scale.width / 130) * (80.4 + 6.3 * i);
      let y = this.game.scale.height / 4.6;
      this.specialCardsMeldA[i] = [x, y];
    }

    //RIVIALS SPECIAL MELD COORDINATES
    for (let i = 0; i < 4; i++) {
      // this.specialCardsMeldB[i] = [];
      let x = (this.game.scale.width / 405) * (80.4 + 19.8 * i);
      let y = this.game.scale.height / 4.6;
      this.specialCardsMeldB[i] = [x, y];
    }
  }

  subscribeToRestoreState() {
    let temp = this.socketScv.restoreState.subscribe((data: any) => {
      if (data && JSON.stringify(data) != '{}') {
        // PLAYER TURN
        console.info(
          'QQQQQQQ',
          this.modal.gameRoom.state.turnIndex,
          this.modal.userServerIndex
        );
        if (this.modal.gameRoom.state.turnIndex == this.modal.userServerIndex) {
          this.myPlayingTurn = true;
          this.deckCardPicked = false;
          this.discardedCardPicked = false;
          this.stockPileHighlighter.visible = true;
          this.discardPileHighlighter.visible;
        } else {
          this.myPlayingTurn = false;
          // this.cardsArray.forEach((card: any) => {
          //   card.movedUp = false;
          // });
          // this.arrangeCards(200);
        }

        // this.selectedMeld = [];

        // STOCK PILE
        this.stockCardArray = [];
        this.modal.gameRoom.state.stockPile.forEach((card:any)=>{
          this.stockCardArray.push(card);
        })

        // DISCARD PILE
        this.discardArray.forEach((card: any) => {
          card.destroy();
        });
        this.discardArray = [];
        this.modal.gameRoom.state.discardPile.forEach((card: any) => {
          this.showDiscardedCard(card, false);
        });

        // PLAYER CARDS
        this.cardsArray.forEach((card: any) => {
          card.destroy();
        });
        this.cardsArray = [];
        this.modal.currentPlayerState.cards.forEach((card: any) => {
          this.showMyCards(card);
        });

        this.sortHandCards();
        this.arrangeCards(0, 0);
        ///

        // MELD RESTORE
        for (let i = 0; i < this.modal.rightMeld.length; i++) {
          this.modal.rightMeld[i].meld.map((card: any) => {
            card.destroy();
          });
          console.log('right meld after reset', this.modal.rightMeld[i].meld);
        }

        for (let i = 0; i < this.modal.leftMeld.length; i++) {
          this.modal.leftMeld[i].meld.map((card: any) => {
            card.destroy();
          });
        }

        for (let i = 0; i < this.modal.specialMeldRight.length; i++) {
          this.modal.specialMeldRight[i].meld.map((card: any) => {
            card.destroy();
          });
          this.modal.specialMeldRight[i].rectangle[0].destroy();
          this.modal.specialMeldRight[i].rectangle[1].destroy();
        }

        for (let i = 0; i < this.modal.specialMeldLeft.length; i++) {
          this.modal.specialMeldLeft[i].meld.map((card: any) => {
            card.destroy();
          });
          this.modal.specialMeldLeft[i].rectangle[0].destroy();
          this.modal.specialMeldLeft[i].rectangle[1].destroy();
        }
        this.modal.rightMeld = [];
        this.modal.leftMeld = [];
        this.modal.specialMeldRight = [];
        this.modal.specialMeldLeft = [];

        this.modal.gameRoom.state.meldB;
        this.modal.gameRoom.state[`meld${this.modal.teamName}`].forEach(
          (meld: any) => {
            meld.cards.forEach((meldCard: any) => {
              let map1: { [key: string]: any } = {};
              map1['meldId'] = meld.meldId;
              map1['teamName'] = meld.team;
              map1['cardValue'] = meld.cardValue;
              map1['id'] = meldCard.id;
              map1['value'] = meldCard.value;
              map1['card'] = meldCard.card;
              map1['color'] = meldCard.color;
              map1['pointValue'] = meldCard.pointValue;
              map1['isWild'] = meldCard.isWild;
              map1['isDrawFromDiscard'] = meldCard.isDrawFromDiscard;
              map1['isDrawFromStock'] = meldCard.isDrawFromStock;
              map1['_from'] = meldCard._from;
              map1['isCanasta'] = meld.isCanasta;
              map1['isPureCanasta'] = meld.isPureCanasta;

              this.animateToMeld(map1, 'right', false);
            });
          }
        );

        this.modal.gameRoom.state[
          `meld${this.modal.teamName == 'A' ? 'B' : 'A'}`
        ].forEach((meld: any) => {
          meld.cards.forEach((meldCard: any) => {
            let map1: { [key: string]: any } = {};
            map1['meldId'] = meld.meldId;
            map1['teamName'] = meld.team;
            map1['cardValue'] = meld.cardValue;
            map1['id'] = meldCard.id;
            map1['value'] = meldCard.value;
            map1['card'] = meldCard.card;
            map1['color'] = meldCard.color;
            map1['pointValue'] = meldCard.pointValue;
            map1['isWild'] = meldCard.isWild;
            map1['isDrawFromDiscard'] = meldCard.isDrawFromDiscard;
            map1['isDrawFromStock'] = meldCard.isDrawFromStock;
            map1['_from'] = meldCard._from;
            map1['isCanasta'] = meld.isCanasta;
            map1['isPureCanasta'] = meld.isPureCanasta;

            this.animateToMeld(map1, 'left', false);
          });
        });
        this.sortMeldCards(this.modal.rightMeld);
        this.sortMeldCards(this.modal.specialMeldRight);
        this.sortMeldCards(this.modal.leftMeld);
        this.sortMeldCards(this.modal.specialMeldLeft);
        this.meldRearrange(this.modal.rightMeld, 'right', false);
        this.meldRearrange(this.modal.specialMeldRight, 'rightSpecial', false);
        this.meldRearrange(this.modal.leftMeld, 'left', false);
        this.meldRearrange(this.modal.specialMeldLeft, 'leftSpecial', false);
      }
      setTimeout(() => {
        this.modal.reconnectPopup = false;
        console.log('reconnectPopup...', this.modal.reconnectPopup);
      }, 2000);
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToWinningTeam() {
    let temp = this.socketScv.winnerTeam.subscribe((data: any) => {
      console.log('winning team is>>>', data);
      if (data && JSON.stringify(data) != '{}') {
        if (this.modal.teamName == data) {
          this.modal.gameState = 'You Won!';
        } else {
          this.modal.gameState = 'You lost!';
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToPlayersCard() {
    let temp = this.socketScv.newCard.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(data) != '{}') {
        // console.log(' Card Distributed : ', data, data.pointValue);
        // console.log(' card distributed', data.id)
        this.myCards.push(data);
        this.playerCardDistribution(data);
      }
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
    let temp2 = this.socketScv.playerCardAdded.subscribe((card: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(card) != '{}') {
        if (card.id) {
          let _card: any;
          switch (card._from) {
            case 'MELD_A':
              // console.log("animateMeldToHand MELD_A", _card)
              _card = this.animateMeldToHand(
                card,
                'A' == this.modal.teamName ? 'right' : 'left'
              );
              break;

            case 'MELD_B':
              // console.log("animateMeldToHand MELD_B", _card)
              _card = this.animateMeldToHand(
                card,
                'B' == this.modal.teamName ? 'right' : 'left'
              );
              break;

            case 'STOCK':
              _card = this.createStockToHandCard(card);
              // console.log("XXXX", _card)
              this.cardsArray.push(_card);
              this.sortHandCards();
              // this.arrangeCards();

              _card.on(
                'pointerdown',
                (pointer: any, localX: any, localY: any, event: any) => {
                  console.info('SETTING POINTER DOWN ', _card);

                  this.selectCardFromHand(_card.id);
                }
              );
              break;
            case 'DISCARD':
              this.animateDiscardToHand(card);

              break;
          }
        }

        if (this.modal.cardDistibuted) {
          clearTimeout(this.arrangeCardsTimeout);

          card._from == 'DISCARD' && (this._delayForArrangeCard = 70);

          this.arrangeCardsTimeout = setTimeout(() => {
            // console.log("SSSSSSS", card._from, this._delayForArrangeCard )
            this.arrangeCards(800, this._delayForArrangeCard);
            this._delayForArrangeCard = 0;
          }, 200);
          // console.log('HHHHHH', this.arrangeCardsTimeout)
        }
      }
      // console.log("playerCardAdded", card, this.modal.teamName)
    });

    this.gameComp.gamePlaySubscriptions.push(temp2);
  }

  subscribeToCardOnRemove() {
    // cardRemoved
    let flag = false;
    let temp = this.socketScv.cardRemoved.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      console.log('empty selected cards', data);
      // console.log('empty selected cards>>',data.id)

      if (data && JSON.stringify(data) != '{}') {
        for (let i = 0; i < this.selectedMeld.length; i++) {
          if (this.selectedMeld[i].id == data.id) {
            flag = true;
          }
          break;
        }
        if (flag) {
          this.selectedMeld = [];
          this.modal.meldHistory = [];
        }
      }
    });

    let temp2 = this.socketScv.playerHandCardRemoved.subscribe((card: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(card) != '{}') {
        console.log('playerHandCardRemoved', card);

        clearTimeout(this.arrangeCardsTimeout);

        this.arrangeCardsTimeout = setTimeout(() => {
          this.arrangeCards(800, 0);
        }, 200);
      }
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
    this.gameComp.gamePlaySubscriptions.push(temp2);
  }

  subscribeToStockPile() {
    let flag: boolean = true;
    let temp = this.socketScv.stockPile.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data && JSON.stringify(data) != '{}') {
        this.stockCardArray.push(data);
        if (flag) {
          this.emptyStockPile && this.emptyStockPile.destroy();

          // emptyStockPile.destroy();
          this.stockPile = this.add
            .image(
              (this.game.scale.width / 12.5) * 6.3,
              this.game.scale.height / 2.5,
              'deck'
            )
            .setInteractive()
            .setOrigin(0.5, 0.5);

          this.stockPile.setDisplaySize(
            this.game.scale.width / 15,
            this.game.scale.height / 9.9
          );

          flag = false;

          this.stockPile.on('pointerdown', () => {
            console.log(
              'stockpile pointer down',
              this.myPlayingTurn,
              !this.deckCardPicked
            );
            this.stockPileClickAction();
          });
        }
        if (this.stockCardArray.length < 10) {
          this.stockPileCount.text = this.stockCardArray.length;
        } else {
          this.stockPileCount.text = '';
        }
      }
    });

    let temp2 = this.socketScv.stockPileRemoved.subscribe((card: any) => {
      if (!this.modal.networkConnected) return;
      flag = true;
      if (JSON.stringify(card) != '{}') {
        console.log('stockPile removed', card);
        let _index = this.stockCardArray.findIndex((s: any) => s.id == card.id);
        _index > -1 && this.stockCardArray.splice(_index, 1);
        this.stockPileHighlighter.visible = false;

        if (this.stockCardArray.length < 10 && this.stockCardArray.length > 0) {
          this.stockPileCount.text = this.stockCardArray.length;
        } else {
          this.stockPileCount.text = '';
        }
        if (this.stockCardArray.length == 0) {
          this.stockPile.destroy();
          this.stockPile.destroy();
          this.emptyStockPile = this.add
            .image(
              (this.game.scale.width / 12.5) * 6.3,
              this.game.scale.height / 2.5,
              'emptyPile'
            )
            .setOrigin(0.5, 0.5);
          this.emptyStockPile.setDisplaySize(
            this.game.scale.width / 15,
            this.game.scale.height / 9.9
          );
        }

        if (card.id) {
          // ANIMATE IF OTHERS TURN
          if (!this.myPlayingTurn) {
            //debugger
            console.log('stockPile removed inside');
            this.animateStockToSeat(card);
          }
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
    this.gameComp.gamePlaySubscriptions.push(temp2);
  }

  subscribeToDiscardedCard() {
    // let count =0;
    let temp = this.socketScv.discardedPile.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      console.log('discardedPile ADDED', data);
      if (JSON.stringify(data) != '{}') {
        this.discardPileHighlighter.visible = false;

        this.discardedCardArray.push(data);
        if (data._from.includes('HAND')) {
          console.log('discardedPile ADDED INCLUDES HAND ');
          this.animateHandsToDiscard(data);
        }
        switch (data._from) {
          case 'STOCK':
            this.showDiscardedCard(data);
            break;
          case 'MELD_A':
            this.animateMeldToDiscard(
              data,
              'A' == this.modal.teamName ? 'right' : 'left'
            );

            break;
          case 'MELD_B':
            this.animateMeldToDiscard(
              data,
              'B' == this.modal.teamName ? 'right' : 'left'
            );
            break;
        }
      }
    });

    let temp2 = this.socketScv.discardedPileRemoved.subscribe((card: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(card) != '{}') {
        if (card.id) {
          try {
            let dIndx = this.discardArray.findIndex(
              (c: any) => c.id == card.id
            );
            this.discardArray[dIndx].destroy();
            this.discardArray.splice(dIndx, 1);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
    this.gameComp.gamePlaySubscriptions.push(temp2);
  }

  subscribeToMyTurnToPlay() {
    let temp = this.socketScv.myPlayingTurn.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data >= 0 && JSON.stringify(data) != '{}') {
        if (data == this.modal.userServerIndex) {
          console.log("it's my turn", data);
          this.myPlayingTurn = true;
          this.deckCardPicked = false;
          this.discardedCardPicked = false;
          this.discardPileHighlighter.visible = true;
          this.stockPileHighlighter.visible = true;
        } else {
          console.log("it's not my turn", data);
          this.myPlayingTurn = false;

          this.cardsArray.forEach((card: any) => {
            card.movedUp = false;
          });
          this.arrangeCards(200);
        }
        this.selectedMeld = [];
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToRoundOver() {
    let temp = this.socketScv.Round.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      console.log('round data>>', data);
      if (data.roundCount >= 0 && JSON.stringify(data) != '{}') {
        if (data.roundCount >= 2 && data.status == 'ROUND_OVER') {
          this.modal.showResult = false;
          this.resetDataForNextRound();
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToGameOver() {
    let temp = this.socketScv.gameOver.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(data) != '{}') {
        console.log('  this.modal.showResult', this.modal.showResult);
        if (data == 'GAME_OVER') {
          setTimeout(() => {
            this.modal.showResult = false;
            this.gameComp.leaveGame();
          }, 5000);
        }
      }
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeTeamAMeld() {
    let temp = this.socketScv.meldDataA.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data && JSON.stringify(data) != '{}') {
        this.teamAMeldCard.push(data);
        if (data.teamName == this.modal.teamName) {
          this.animateToMeld(data, 'right');
        } else {
          this.animateToMeld(data, 'left');
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeTeamBMeld() {
    let temp = this.socketScv.meldDataB.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data && JSON.stringify(data) != '{}') {
        this.teamBMeldCard.push(data);
        if (data.teamName == this.modal.teamName) {
          this.animateToMeld(data, 'right');
        } else {
          this.animateToMeld(data, 'left');
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToUndoTeamAMeld() {
    let temp = this.socketScv.undoMeldA.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(data) != '{}') {
        console.log('undo dataVAlue A', data, data.cardValue);

        if (this.myPlayingTurn) {
          return;
        }

        if (data.isDrawFromDiscard) {
          return;
        }

        if (data.teamName == this.modal.teamName) {
          this.animateMeldToHand(data, 'right');
        } else {
          this.animateMeldToHand(data, 'left');
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToUndoTeamBMeld() {
    let temp = this.socketScv.undoMeldB.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (JSON.stringify(data) != '{}') {
        console.log('undo dataVAlue B', data, data.value);

        if (!this.myPlayingTurn) {
          if (data.teamName == this.modal.teamName) {
            this.animateMeldToHand(data, 'right');
          } else {
            this.animateMeldToHand(data, 'left');
          }
        }
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToAnimation() {
    let temp = this.socketScv.playAnimation.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data && JSON.stringify(data) != '{}') {
        console.log('animation', data, data.type);
        this.playCardAnimation(data);
      }
    });
    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  subscribeToCanastaUpdate() {
    let temp = this.socketScv.meldCanastaUpdate.subscribe((data: any) => {
      if (!this.modal.networkConnected) return;
      if (data && JSON.stringify(data) != '{}') {
        console.log('meldCanastaUpdate', data);

        let side = '';
        if (data.team == this.modal.teamName) {
          side = 'right';
        } else {
          side = 'left';
        }
        let cardType = this.setCardType(data, side);

        let _meld: any;

        switch (cardType) {
          case 'right':
            _meld = this.modal.rightMeld;

            break;
          case 'rightSpecial':
            _meld = this.modal.specialMeldRight;

            break;

          case 'left':
            _meld = this.modal.leftMeld;
            break;

          case 'leftSpecial':
            _meld = this.modal.specialMeldLeft;

            break;
        }

        let meld = _meld.find((m: any) => m.value == data.cardValue);
        meld.isCanasta = data.isCanasta;
        meld.isPureCanasta = data.isPureCanasta;

        console.log('CANASTA UPDATE', meld);

        this.meldRearrange(_meld, cardType);
      }
    });

    this.gameComp.gamePlaySubscriptions.push(temp);
  }

  isSpecialCard(card: any): boolean {
    let isSpecialCard: boolean = false;
    if (
      card == '3' ||
      card == '2' ||
      card == 'A' ||
      card == '7' ||
      card == 'joker'
    ) {
      isSpecialCard = true;
    }
    return isSpecialCard;
  }

  isSpecialMeld(meldCardValue: number) {
    return [999, 3, 7, 14].includes(meldCardValue);
  }

  setDepthOfMeldCard(index: any, card?: any): number {
    let depth = 0;

    if (card == 'joker' || card == '2') {
      if (card == 'joker') {
        depth = 0;
      } else {
        depth = 1;
      }
    } else {
      switch (index) {
        case 0:
          depth = 10;
          break;
        case 1:
          depth = 20;
          break;
        case 2:
          depth = 30;
          break;
        case 3:
          depth = 40;
          break;
        case 4:
          depth = 50;
          break;
        case 5:
          depth = 60;
          break;
        case 6:
          depth = 70;
          break;
        case 7:
          depth = 80;
          break;
        case 8:
          depth = 90;
          break;
      }
    }
    return depth;
  }

  resetDataForNextRound() {
    this.modal.cardDistibuted = false;
    this.modal.firstDiscardCard = true;
    this.modal.sortedArray = [];
    this.modal.cardNewArray = [];
    this.stockCardArray = [];
    this.discardedCardArray = [];
    this.teamAMeldCard = [];
    this.teamBMeldCard = [];
    this.myCards = [];
    let card: any;
    this.myPlayingTurn = true;
    this.deckCardPicked = false;
    while (this.cardsArray.length) {
      card = this.cardsArray.pop();
      card.destroy();
    }
    console.log('cards array reset', this.cardsArray, this.cardsArray.length);

    while (this.discardArray.length) {
      card = this.discardArray.pop();
      card.destroy();
    }

    for (let i = 0; i < this.modal.rightMeld.length; i++) {
      this.modal.rightMeld[i].meld.map((card: any) => {
        card.destroy();
      });
      console.log('right meld after reset', this.modal.rightMeld[i].meld);
    }

    for (let i = 0; i < this.modal.leftMeld.length; i++) {
      this.modal.leftMeld[i].meld.map((card: any) => {
        card.destroy();
      });
    }

    for (let i = 0; i < this.modal.specialMeldRight.length; i++) {
      this.modal.specialMeldRight[i].meld.map((card: any) => {
        card.destroy();
      });
      this.modal.specialMeldRight[i].rectangle[0].destroy();
      this.modal.specialMeldRight[i].rectangle[1].destroy();
    }

    for (let i = 0; i < this.modal.specialMeldLeft.length; i++) {
      this.modal.specialMeldLeft[i].meld.map((card: any) => {
        card.destroy();
      });
      this.modal.specialMeldLeft[i].rectangle[0].destroy();
      this.modal.specialMeldLeft[i].rectangle[1].destroy();
    }

    this.modal.specialMeldRight = [];
    this.modal.rightMeld = [];
    this.modal.leftMeld = [];
    this.modal.specialMeldLeft = [];

    console.log('AAA', this.modal.rightMeld);
    console.log('BBB', this.modal.leftMeld);
    console.log('CCC', this.modal.specialMeldLeft);
    console.log('DDD', this.modal.specialMeldRight);
  }

  ///////////////////

  playerCardDistribution(card: any) {
    this.showMyCards(card);
  }
  showOtherPlayerCards() {
    //// other players card animation only

    this.showOpponent3Cards(70,800);
    this.showOpponent2Cards(70,800)
    // this.showOpponent4Cards();
  }

  showOpponent3Cards(delay:any,tweenDuration:any) {
    let i=0;
    let interval  = setInterval(()=>{
      if(i>13){
        clearInterval(interval)
      }
      let opponentCard= this.add
      .image(
        this.game.scale.width / 2,
        this.game.scale.height / 2.4,
        'opponentcard2'
      )
      .setOrigin(0.5, 0.5);
    opponentCard.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    opponentCard.angle = 90;
    
      let self = this;
      let cardTween = self.tweens.add({
        targets: [opponentCard],
        x: 0,
        y: this.game.scale.height / 2.3,
        // scale: 0,
        ease: 'Elastic',
        easeParams: [0, 1.5],
        duration: tweenDuration,
        yoyo: false,
        angle: 0,
        onComplete(cardTween) {
          cardTween.stop();
          opponentCard.destroy();

        },
      });
      i++

    },delay)



    // for (let j = 0; j < 13; j++) {
    //   opponentCard = this.add
    //     .image(
    //       this.game.scale.width / 2,
    //       this.game.scale.height / 2.4,
    //       'opponentcard2'
    //     )
    //     .setOrigin(0.5, 0.5);
    //   opponentCard.setDisplaySize(
    //     (this.game.scale.width / 40) * 1.8,
    //     (this.game.scale.width / 40) * 2.6
    //   );
    //   opponentCard.angle = 90;
    //   opponentCard.setDepth(0);

    //   let self = this;
    //   let cardTween = self.tweens.add({
    //     targets: [opponentCard],
    //     x: 0,
    //     y: this.game.scale.height / 2.3,
    //     // scale: 0,
    //     ease: 'Circ.easeIn',
    //     duration: 50 + j * 120,
    //     yoyo: false,
    //     angle: 0,
    //     alpha: { from: 1, to: 0 },
    //     onComplete(cardTween) {
    //       cardTween.stop();
    //       opponentCard.destroy();
    //     },
    //   });
    // }
  }

  showOpponent4Cards() {
    let opponentCard: any;
    for (let j = 0; j < 13; j++) {
      opponentCard = this.add
        .image(
          this.game.scale.width / 2,
          this.game.scale.height / 2.4,
          'opponentcard1'
        )
        .setOrigin(0.5, 0.5);
      opponentCard.setDisplaySize(
        (this.game.scale.width / 40) * 1.8,
        (this.game.scale.width / 40) * 2.6
      );
      opponentCard.angle = 90;
      let self = this;
      let cardTween = self.tweens.add({
        targets: [opponentCard],
        x: this.game.scale.width / 1.9,
        y: 0,
        // scale: 0,
        ease: 'Circ.easeIn',
        duration: 50 + j * 120,
        yoyo: false,
        angle: 0,
        onComplete(cardTween) {
          opponentCard.destroy();
          cardTween.stop();
        },
      });
    }
  }

  showOpponent2Cards(delay:any,tweenDuration:any) {
    
    let i=0;
    let interval  = setInterval(()=>{
      if(i>13){
        clearInterval(interval)
      }
      let opponentCard= this.add
      .image(
        this.game.scale.width / 2,
        this.game.scale.height / 2.4,
        'opponentcard2'
      )
      .setOrigin(0.5, 0.5);
    opponentCard.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    opponentCard.angle = 90;
    
      let self = this;
      let cardTween = self.tweens.add({
        targets: [opponentCard],
        x: this.game.scale.width / 0.5,
        y: this.game.scale.height / 2.5,
        ease: 'Elastic',
        easeParams: [0, 1.5],
        duration: tweenDuration,
        yoyo: false,
        angle: 0,
        onComplete(cardTween) {
          cardTween.stop();
          opponentCard.destroy();

        },
      });
      i++

    },delay)

    // for (let j = 0; j < 13; j++) {
    //   opponentCard = this.add
    //     .image(
    //       this.game.scale.width / 2,
    //       this.game.scale.height / 2.4,
    //       'opponentcard2'
    //     )
    //     .setOrigin(0.5, 0.5);
    //   opponentCard.setDisplaySize(
    //     (this.game.scale.width / 40) * 1.8,
    //     (this.game.scale.width / 40) * 2.6
    //   );
    //   opponentCard.angle = 90;
    //   let self = this;
    //   let cardTween = self.tweens.add({
    //     targets: [opponentCard],
    //     x: this.game.scale.width / 0.5,
    //     y: this.game.scale.height / 2.5,
    //     // scale: 0,
    //     ease: 'Circ.easeIn',
    //     duration: 50 + j * 120,
    //     yoyo: false,
    //     angle: 0,
    //     onComplete(cardTween) {
    //       opponentCard.destroy();
    //       cardTween.stop();
    //     },
    //   });
    // }
  }

  showMyCards(card: any) {
    this.playSound('shuffling-cards');
    // this.shuffling_cards.play();
    console.log('Card Received showMyCards >>>> ', card);

    let ex = this.cardsArray.find((c: any) => c.id == card.id);
    if (!ex) {
      let newCard: any = this.add
        .image(
          (this.game.scale.width / 12.5) * 6.3,
          this.game.scale.height / 2.5,
          card.id
        )
        .setOrigin(0.5, 0.5)
        .setInteractive();
      newCard.setDisplaySize(
        (this.game.scale.width / 40) * 1.8,
        (this.game.scale.width / 40) * 2.6
      );
      newCard.angle = 90;
      newCard.id = card.id;
      newCard.isWild = card.isWild;
      newCard.value = card.value;
      newCard.color = card.color;
      newCard.suit = card.suit;
      newCard.card = card.card;
      newCard.movedUp = false;
      newCard
        .setInteractive()
        .on(
          'pointerdown',
          (pointer: any, localX: any, localY: any, event: any) => {
            console.info('SETTING POINTER DOWN ', newCard);
            this.selectCardFromHand(newCard.id);
          }
        );

      this.cardsArray.push(newCard);
      this.myCards = [];
    }

    console.log('check cards array length>>', this.cardsArray.length);
    if (!this.modal.cardDistibuted && this.cardsArray.length >= 13) {
      // this.modal.cardDistibuted = true;
      this.sortHandCards();
      this.arrangeCards(800, 70);
    }
  }

  sortHandCards() {
    this.cardsArray.sort((a: any, b: any) =>
      a.value > b.value ? 1 : b.value > a.value ? -1 : 0
    );
  }

  arrangeCards(tweenDuration: number = 800, delay: number = 0) {
    this.playSound('card-add-new');
    // this.card_add_new.play()
    // console.log('aarangeCards', delay, tweenDuration)
    let targetX = 0;
    let cardCount = 1;
    // console.log('cards array length>>', this.cardsArray, tweenDuration, delay);

    let _l = this.cardsArray.length;
    let i = 0;
    let rowY = 0,
      col = 0;
    let h = this.game.scale.height;
    let _w = 0;

    let _cardsInOneRow = _l > 40 ? 26 : 20;
    let _gapBtwCard = _l > 40 ? 3 : 4;

    // card width;
    let _cW =
      (this.game.scale.width / 107) * (15.5 + _gapBtwCard * 2) -
      (this.game.scale.width / 107) * (15.5 + _gapBtwCard * 1);

    let fullRows = Math.floor(_l / _cardsInOneRow);
    let fullRowsCardsCount = fullRows * _cardsInOneRow; // card number which rows are full

    let firstRow_w =
      _l >= _cardsInOneRow
        ? 0
        : _cW * ((_cardsInOneRow - (_l % _cardsInOneRow)) / 2);
    let secondRow_w =
      _l >= _cardsInOneRow * 2
        ? 0
        : _cW *
          ((_cardsInOneRow - ((_l - _cardsInOneRow) % _cardsInOneRow)) / 2);

    let interval = setInterval(() => {
      if (i > this.cardsArray.length - 1) {
        clearInterval(interval);
      }
      // targetX = (this.game.scale.width / 107) * (15.5 + (4 * (i)));

      // console.log('Index>>', i);
      if (!this.cardsArray[i]) return;
      let card = this.cardsArray[i];
      // card.movedUp = false;

      // console.info("CARD....", card.value, card.movedUp)

      card.setDepth(i + 1);

      // ROW WISE CALCULATION
      if (i >= fullRowsCardsCount || i >= _cardsInOneRow) {
        rowY = (h / 45) * 43 + (card.movedUp ? -40 : 0);
      } else {
        rowY = (h / 49) * 42.6 + (card.movedUp ? -40 : 0);
      }

      if (i < _cardsInOneRow) {
        // console.info("LLLLLLL UPPER", fullRowsCardsCount)
        _w = firstRow_w;
      } else {
        // console.info("LLLLLLL LOWER", fullRowsCardsCount)
        // if (i < fullRowsCardsCount) {
        //     _w=0
        // }else{
        // _w = (_cW * ((_cardsInOneRow - (_l % _cardsInOneRow)) / 2));
        _w = secondRow_w;
        // }
      }

      // if(i<_cardsInOneRow){
      //     _w = firstRow_w
      // }else{
      //     _w = secondRow_w
      // }

      targetX =
        (this.game.scale.width / 107) *
          (15.5 + _gapBtwCard * (i % _cardsInOneRow)) +
        _w;

      // let tweenDuration = distribution ? (50 + (i * 30)) : 400;

      let self = this;
      let cardTween = self.tweens.add({
        targets: [card],
        x: targetX,
        y: rowY,
        // scale: 0,
        ease: 'Elastic',
        easeParams: [0, 1.5],
        duration: tweenDuration,
        yoyo: false,
        angle: 0,
        onComplete(cardTween) {
          cardTween.stop();
          if (cardCount == 13) {
            self.modal.gameRoom.send('READY_FOR_ROUND');
            self.modal.cardDistibuted = true;
          } else {
            cardCount++;
          }
        },
      });
      i++;
    }, delay);
  }

  stockPileClickAction() {
    if (this.myPlayingTurn && !this.deckCardPicked) {
      this.discardPileHighlighter.visible = false;
      this.stockPileHighlighter.visible = false;
      console.log('Drawn card send to server');
      this.modal.gameRoom.send('DRAW_CARD_FROM_STOCK');
      this.deckCardPicked = true;
      this.cardpicked = true;
    }
  }

  discardPileClickAction() {
    console.info(
      'DISCARD PILE CLICKED',
      this.deckCardPicked,
      this.discardedCardPicked
    );

    // DRAW CARD
    if (!this.deckCardPicked && !this.discardedCardPicked) {
      this.discardPileHighlighter.visible = false;
      this.stockPileHighlighter.visible = false;
      this.discardedCardPicked = true;
      this.cardpicked = true;
      this.modal.gameRoom.send('DRAW_CARD_FROM_DISCARD');
      console.log('Draw card from discard');
      // this.deckCardPicked = true;
      return;
    }

    // DISCARD CARD
    // if(this.deckCardPicked && !this.discardedCardPicked) {
    if (this.selectedMeld.length == 1) {
      this.discardPileHighlighter.visible = false;
      if (this.lastPickedCard) {
        let id = this.lastPickedCard.id;
        this.modal.gameRoom.send('DISCARD_CARD', { cardId: id });
        console.log('the last picked card', this.lastPickedCard);
        return;
      }
    } else {
      this.modal.showErrorMessage = true;
      this.modal.message = 'You can only discard one card at a time';
      setTimeout(() => {
        this.modal.showErrorMessage = false;
      }, 1500);
    }
  }

  selectCardFromHand(cardId: any) {
    console.log('selectCardFromHand', cardId);
    
    if (!this.myPlayingTurn) {
      console.info('NOT YOUR TURN!');
      this.modal.showErrorMessage = true;
      this.modal.message = 'Not Your Turn!';
      setTimeout(() => {
        this.modal.showErrorMessage = false;
      }, 1500);
      return;
    }

    if (!this.deckCardPicked && !this.discardedCardPicked) {
      console.info('NO CARD PICKED YET!');
      this.modal.showErrorMessage = true;
      this.modal.message = 'You need to draw or use the discard pile first';
      setTimeout(() => {
        this.modal.showErrorMessage = false;
      }, 1500);
      return;
    }

    // CHECK VALID CARD
    let card = this.cardsArray.find((x: any) => x.id == cardId);
    if (!card) {
      console.info('NOT VALID CARD');
      return;
    }

    // SELECT CARD
    if (!card.movedUp) {
      this.playSound('btn-sound');
      // card.y = card.y - 40;
      // let pickedCard = this.cardsArray.find((x: any) => x.id == this.dragObj.id);
      console.log('pickedCard>>>>', card);
      this.selectedMeld.push(card);
      console.log('selected cards array', this.selectedMeld);
      this.lastPickedCard = card;
      // this.showMyMelds();
      card.movedUp = true;
      this.cardpicked = true;
      if (this.selectedMeld.length == 1) {
        this.discardPileHighlighter.visible = true;
      } else {
        this.discardPileHighlighter.visible = false;
      }
    } else {
      this.playSound('btn-sound');

      // UNSELECT IF ALREADY SELECTED
      // card.y = card.y + 40;
      card.movedUp = false;
      card.cardpicked = false;
      // this.cardsArray.splice(this.cardsArray.indexOf(card), 1);
      // this.selectedMeld.splice(this.selectedMeld.indexOf(card.id), 1)
      this.selectedMeld.splice(
        this.selectedMeld.findIndex((c: any) => c.id == cardId),
        1
      );
      if (this.selectedMeld.length == 1) {
        this.discardPileHighlighter.visible = true;
      } else {
        this.discardPileHighlighter.visible = false;
      }
      this.lastPickedCard = this.selectedMeld.length
        ? this.selectedMeld[this.selectedMeld.length - 1]
        : null;
      console.log('selected cards array after remove ', this.selectedMeld);
    }

    this.arrangeCards(200);
  }

  showMyMelds() {
    console.log('inside show melds', this.cardpicked);
    this.meldboard = this.add
      .image(this.game.scale.width / 1.35, this.game.scale.height / 1.9, 'bg')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.meldboard.setDisplaySize(
      (this.game.scale.width / 40) * 15,
      (this.game.scale.width / 40) * 6.7
    );
    this.meldboard.alpha = 0.0002;

    this.meldboard.on('pointerdown', this.sendMeldToServer, this);
    console.log('inside show melds', this.cardpicked);
    this.specialCardMeldBoard = this.add
      .image(this.game.scale.width / 1.4, this.game.scale.height / 4.6, 'bg')
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.specialCardMeldBoard.setDisplaySize(
      (this.game.scale.width / 40) * 10,
      (this.game.scale.width / 40) * 3
    );
    this.specialCardMeldBoard.alpha = 0.2;
    this.specialCardMeldBoard.on('pointerdown', this.sendMeldToServer, this);
  }

  sendMeldToServer() {
    console.log(
      'meldLength',
      this.selectedMeld.length,
      this.modal.meldHistory != this.selectedMeld
    );
    if (
      !this.modal.showErrorMessage &&
      this.modal.meldHistory != this.selectedMeld &&
      this.selectedMeld.length != 0
    ) {
      this.modal.meldHistory = this.selectedMeld;

      if (this.lastPickedCard) {
        let meldData = this.setMeldData();
        console.log(
          'CARD TO SERVER',
          meldData,
          meldData.meldCards,
          meldData.meldValue
        );
        this.modal.gameRoom.send('ADD_TO_MELD', {
          cardIds: meldData.meldCards,
          meldCardValue: meldData.meldValue,
        });

        this.cardpicked = true;
      }
    }
    this.cardpicked = true;
  }

  setMeldData(): any {
    let meldValue = 0;
    let meldCards: any[] = [];
    let flag = true;
    if (this.selectedMeld.find((card: any) => card.isWild == false)) {
      flag = false;
    }

    if (flag) {
      meldValue = 999;
      let i = 0;
      this.selectedMeld.map((c: any) => {
        meldCards[i] = c.id;
        i++;
      });

      return { meldValue, meldCards };
    }
    if (!flag) {
      let i = 0;
      let card: any = this.selectedMeld.find(
        (card: any) => card.isWild == false
      );
      meldValue = card.value;
      this.selectedMeld.map((c: any) => {
        meldCards[i] = c.id;
        i++;
      });

      return { meldValue: meldValue, meldCards: meldCards };
    }

    return {};
  }

  addCardToExsitingMeld(targetValue: any) {
    console.log('send selected meld card to server', this.selectedMeld);
    let meldCardsToServer: any = [];

    if (
      !this.modal.showErrorMessage &&
      this.modal.meldHistory != this.selectedMeld &&
      this.selectedMeld.length != 0
    ) {
      this.modal.meldHistory = this.selectedMeld;
      for (let i = 0; i < this.selectedMeld.length; i++) {
        meldCardsToServer[i] = this.selectedMeld[i].id;
      }
      console.log('added card send to server', meldCardsToServer);
      this.modal.gameRoom.send('ADD_TO_MELD', {
        cardIds: meldCardsToServer,
        meldCardValue: targetValue,
      });
      this.cardpicked = true;
    }
    this.cardpicked = true;
  }

  setCardType(card: any, type: string): string {
    let cardType = '';
    let cardValue = card.cardValue ? card.cardValue : card.value;
    let specialCard = false;

    if (
      cardValue == 3 ||
      cardValue == 7 ||
      cardValue == 999 ||
      cardValue == 14
    ) {
      specialCard = true;
    }

    if (type == 'right' && specialCard) {
      cardType = 'rightSpecial';
      return cardType;
    }
    if (type == 'right') {
      cardType = 'right';
      return cardType;
    }

    if (type == 'left' && specialCard) {
      cardType = 'leftSpecial';
      return cardType;
    }

    if (type == 'left') {
      cardType = 'left';
      return cardType;
    }
    return '';
  }

  calcMeldTarget(data: any): Array<number> {
    let seat = 0;
    let targetX = 0;
    let targetY = 0;
    let _card_i: any;
    let card: any;
    let angle = 0;

    if (data.isDrawFromStock) {
      let stIndex = this.stockCardArray.findIndex((d: any) => d.id === data.id);
      if (stIndex > -1) {
        this.stockCardArray[stIndex].destroy();
        this.stockCardArray.splice(stIndex, 1);
      }

      targetX = (this.game.scale.width / 12.5) * 6.3;
      targetY = this.game.scale.height / 2.5;

      return [targetX, targetY, 90];
    }
    if (data.isDrawFromDiscard) {
      let dcIndex = this.discardArray.findIndex((d: any) => d.id === data.id);

      if (dcIndex > -1) {
        this.discardArray[dcIndex].destroy();
        this.discardArray.splice(dcIndex, 1);
      }

      targetX = (this.game.scale.width / 12.5) * 6.3;
      targetY = this.game.scale.height / 1.9;
      return [targetX, targetY, 90];
    }

    for (let currentPlayer of this.modal.allPlayers) {
      // console.log('current player index', currentPlayer.index, this.modal.playerIndex)
      if (currentPlayer.index == this.modal.playerIndex) {
        seat = currentPlayer.seat;
        // console.log('players seat undo', seat)
        break;
      }
    }

    switch (seat.toString()) {
      case '1':
        _card_i = this.cardsArray.findIndex((x: any) => x.id == data.id);
        card = this.cardsArray[_card_i];
        targetX = card.x;
        targetY = card.y;
        card.destroy();
        this.cardsArray.splice(_card_i, 1);

        break;

      case '2':
        targetX = this.game.scale.width / 70;
        targetY = this.game.scale.height / 2.3;
        break;

      case '3':
        targetX = this.game.scale.width / 1.9;
        targetY = this.game.scale.height / 30;
        break;

      case '4':
        targetX = this.game.scale.width / 1.02;
        targetY = this.game.scale.height / 2.3;
        break;
    }

    return [targetX, targetY, 0];
  }
  sortMeldCards(meldToSort: any) {
    meldToSort.sort((a: any, b: any) =>
      a.value > b.value ? 1 : b.value > a.value ? -1 : 0
    );
  }

  meldRearrange(meldArray: any, type: string, animate: boolean = true) {
    let count = 0;
    let depth = 100;
    let easeParams = [0, 1.5];
    let tweenDuration = animate ? 800 : 0;
    let targetY = 0;

    switch (type) {
      case 'right':
        for (let i = 0; i < meldArray.length; i++) {
          let pos = this.rightMeldCordinates[i];
          count = 0;
          this.sortMeld(meldArray[i].meld);
          console.log('meldArray[i].meld', meldArray[i].meld);
          meldArray[i].meld.map((card: any) => {
            console.log(
              'isCanasta',
              meldArray[i].isCanasta,
              meldArray[i].isPureCanasta
            );
            if (!meldArray[i].isCanasta) {
              targetY = pos[1] + (81 + 40 * (count - 1 - 1));
              card.clearTint();
              meldArray[i].isCanastaSoundPlayed = false;
            } else {
              // PLAY CANASTA SOUND
              if (!meldArray[i].isCanastaSoundPlayed) {
                this.playSound('Canasta-Completion');
                meldArray[i].isCanastaSoundPlayed = true;
              }

              let tint = meldArray[i].isPureCanasta ? 0xff6666 : 0xa9a9a9;
              card.setTint(tint);
              console.log('SORTED_MELD', meldArray[i].meld);
              targetY = pos[1] + (4 + 2 * (count - 1 - 1));
            }

            // if( meldArray[i].meld.length < 4){
            //   targetY = pos[1] + (50 + 28 * (count - 1 - 1));
            //   card.clearTint();
            // }
            // else{
            //   card.setTint(0xb30000);
            //   targetY = pos[1];
            // }
            card.setDepth(++depth);
            let self = this;
            let cardTween = this.tweens.add({
              targets: [card],
              x: pos[0],
              y: targetY,
              ease: 'Elastic',
              easeParams: easeParams,
              duration: tweenDuration,
              yoyo: false,
              angle: 0,

              onComplete(cardTween) {
                cardTween.stop();
                self.cardpicked = true;
              },
            });
            count++;
          });
        }
        break;

      case 'rightSpecial':
        for (let i = 0; i < meldArray.length; i++) {
          let pos = this.specialCardsMeldA[i];
          count = 0;
          this.sortMeld(meldArray[i].meld);
          console.log('meldArray[i].meld', meldArray[i].meld);

          meldArray[i].meld.map((card: any) => {
            if (!meldArray[i].isCanasta || meldArray[i].meld.length < 7) {
              card.clearTint();
              meldArray[i].isCanastaSoundPlayed = false;
            } else {
              // PLAY CANASTA SOUND
              if (!meldArray[i].isCanastaSoundPlayed) {
                this.playSound('Canasta-Completion');
                meldArray[i].isCanastaSoundPlayed = true;
              }
              let tint = meldArray[i].isPureCanasta ? 0xff6666 : 0xa9a9a9;
              card.setTint(tint);
            }
            card.setDepth(++depth);
            let self = this;
            let cardTween = this.tweens.add({
              targets: [card],
              x: pos[0],
              y: pos[1],
              ease: 'Elastic',
              easeParams: easeParams,
              duration: tweenDuration,
              yoyo: false,
              angle: 0,

              onComplete(cardTween) {
                cardTween.stop();
                self.cardpicked = true;
              },
            });

            count++;
          });

          // FOR SPECIAL CARD COUNT
          if (meldArray[i]?.rectangle?.length) {
            meldArray[i].rectangle[0].destroy();
            meldArray[i]?.rectangle[1]?.destroy();
            meldArray[i].rectangle = [];
          }
          meldArray[i].rectangle = this.createRect(
            pos[0],
            pos[1],
            depth,
            meldArray[i]?.meld?.length
          );

          // FOR RECTANGLE
          // if (meldArray[i]?.rectangle?.length) { meldArray[i].rectangle[0].destroy(); meldArray[i].rectangle[1].destroy(); meldArray[i].rectangle = [] }
          // meldArray[i].rectangle = this.createRect(pos[0], pos[1], depth, meldArray[i].meld.length);

          // let r = this.add.graphics().fillStyle(0x32637d, 1).fillRoundedRect(x, y, 35, 35, { bl: 8, br: 2, tl: 2, tr: 2 })
          // r.setDepth(++depth);

          // let t: any = this.add.text(x+(35/2), y+(35/2), meldArray[i].meld.length, textStyle).setOrigin(0.5, 0.5);
          // t.setDepth(++depth);
          // // meldArray[i].rectangle.setShadow(2, 2, 'rgba(0,0,0,0.1)', 2);
          // // r.setTextBounds(x, y, x+30, y+30);

          // meldArray[i].rectangle = [r, t];
        }

        break;

      case 'left':
        for (let i = 0; i < meldArray.length; i++) {
          let pos = this.leftMeldCordinates[i];
          this.sortMeld(meldArray[i].meld);
          console.log('meldArray[i].meld', meldArray[i].meld);
          count = 0;

          meldArray[i].meld.map((card: any) => {
            console.log(
              'isCanasta_left',
              meldArray[i].isCanasta,
              meldArray[i].isPureCanasta
            );

            if (!meldArray[i].isCanasta || meldArray[i].meld.length < 7) {
              targetY = pos[1] + (81 + 40 * (count - 1 - 1));
              card.clearTint();
              meldArray[i].isCanastaSoundPlayed = false;
            } else {
              if (!meldArray[i].isCanastaSoundPlayed) {
                this.playSound('Canasta-Completion');
                meldArray[i].isCanastaSoundPlayed = true;
              }

              let tint = meldArray[i].isPureCanasta ? 0xff6666 : 0xa9a9a9;
              card.setTint(tint);
              console.log('SORTED_MELD', meldArray[i].meld);
              targetY = pos[1] + (4 + 2 * (count - 1 - 1));
            }
            card.setDepth(++depth);
            let self = this;
            let cardTween = this.tweens.add({
              targets: [card],
              x: pos[0],
              y: targetY,
              ease: 'Elastic',
              easeParams: easeParams,
              duration: tweenDuration,
              yoyo: false,
              angle: 0,

              onComplete(cardTween) {
                cardTween.stop();
                self.cardpicked = true;
              },
            });
            count++;
          });
          // meldArray[i].meld.map((card: any) => {
          //   if (meldArray[i].meld.length < 5) {
          //     targetY = pos[1] + (50 + 28 * (count - 1 - 1));
          //   } else {
          //     this.sortMeld(meldArray[i].meld);
          //     console.log('SORTED_MELD left',meldArray[i].meld)
          //     targetY = pos[1];
          //   }
          //   card.setDepth(++depth);
          //   let self = this;
          //   let cardTween = this.tweens.add({
          //     targets: [card],
          //     x: pos[0],
          //     y: pos[1],
          //     ease: 'Elastic',
          //     easeParams: easeParams,
          //     duration: tweenDuration,
          //     yoyo: false,
          //     angle: 0,

          //     onComplete(cardTween) {
          //       cardTween.stop();
          //       self.cardpicked = true;
          //     },
          //   });

          //   count++;
          // });
        }
        break;

      case 'leftSpecial':
        for (let i = 0; i < meldArray.length; i++) {
          let pos = this.specialCardsMeldB[i];
          count = 0;
          this.sortMeld(meldArray[i].meld);
          meldArray[i].meld.map((card: any) => {
            if (!meldArray[i].isCanasta || meldArray[i].meld.length < 7) {
              card.clearTint();
              meldArray[i].isCanastaSoundPlayed = false;
            } else {
              if (!meldArray[i].isCanastaSoundPlayed) {
                this.playSound('Canasta-Completion');
                meldArray[i].isCanastaSoundPlayed = true;
              }
              let tint = meldArray[i].isPureCanasta ? 0xff6666 : 0xa9a9a9;
              card.setTint(tint);
            }
            card.setDepth(++depth);
            let self = this;
            let cardTween = this.tweens.add({
              targets: [card],
              x: pos[0],
              y: pos[1],
              ease: 'Elastic',
              easeParams: easeParams,
              duration: tweenDuration,
              yoyo: false,
              angle: 0,
              onComplete(cardTween) {
                cardTween.stop();
                self.cardpicked = true;
              },
            });
            count++;
          });

          // FOR SPECIAL CARD COUNT
          if (meldArray[i]?.rectangle?.length) {
            meldArray[i]?.rectangle[0]?.destroy();
            meldArray[i]?.rectangle[1]?.destroy();
            meldArray[i].rectangle = [];
          }
          meldArray[i].rectangle = this.createRect(
            pos[0],
            pos[1],
            depth,
            meldArray[i]?.meld?.length
          );
        }
        break;
    }
  }

  sortMeld(meld: any) {
    meld.sort((a: any, b: any) => {
      let a1 = a.value,
        b1 = b.value;

      if (a.card == 'joker') a1 = -1;
      if (b.card == 'joker') b1 = -1;

      // if (a.card == 'joker' || b.card == 'joker' ) {
      //   console.log("JOKER SORT", a.value, b.value);
      //   return -1;
      // }
      // return a.value > b.value ? 1 : (b.value > a.value) ? -1 : 0;
      return a1 > b1 ? 1 : b1 > a1 ? -1 : 0;
    });

    return meld;
  }

  createRect(_x: number, _y: number, depth: number, txt: string) {
    var textStyle = { font: 'bold 18px Arial', color: '#fff' };

    let x = _x - ((this.game.scale.width / 40) * 0.8) / 2;
    let y = _y + ((this.game.scale.width / 40) * 1.6) / 1.9;

    // let r = this.add
    //   .graphics()
    //   .fillStyle(0x32637d, 1)
    //   .fillRoundedRect(x, y, 35, 35, { bl: 8, br: 2, tl: 2, tr: 2 });
    // rectangleBox
    let r = this.add.image(x, y, 'rectangleBox').setInteractive();
    r.setDisplaySize(
      (this.game.scale.width / 115) * 2.9,
      (this.game.scale.width / 115) * 2.6
    );
    r.setDepth(++depth);

    let t: any = this.add.text(r.x, r.y, txt, textStyle).setOrigin(0.5, 0.5);
    t.setDepth(++depth);
    // meldArray[i].rectangle.setShadow(2, 2, 'rgba(0,0,0,0.1)', 2);
    // r.setTextBounds(x, y, x+30, y+30);

    return [r, t];
  }

  calcUndoMeldTarget(data: any, type: string): Array<number> {
    //debugger
    let xy = [0, 0];
    let _card_i = 0;
    let card: any;
    let meldObj: any;
    let _meld;
    console.log('_isCanasta', data.isCanasta);
    switch (type) {
      case 'right':
        _meld = this.modal.rightMeld;

        break;

      case 'rightSpecial':
        _meld = this.modal.specialMeldRight;
        break;

      case 'left':
        _meld = this.modal.leftMeld;
        break;

      case 'leftSpecial':
        _meld = this.modal.specialMeldLeft;
        break;
    }

    console.log('calcUndoMeldTarget', type);
    console.log('calcUndoMeldTarget', _meld);
    // find card
    let meldObjIndex = _meld.findIndex((x: any) =>
      x.meld.find((y: any) => y.id == data.id)
    );
    meldObj = _meld[meldObjIndex];
    console.log('calcUndoMeldTarget, meldObj', meldObj);
    _card_i = meldObj.meld.findIndex((x: any) => x.id == data.id);
    if (_card_i < 0) {
      return xy;
    }

    card = meldObj.meld[_card_i];
    xy = [card.x, card.y];
    meldObj.meld.splice(_card_i, 1);
    if (meldObj.meld.length == 0) {
      if (meldObj?.rectangle?.length) {
        meldObj.rectangle[0].destroy();
        meldObj.rectangle[1].destroy();
        meldObj.rectangle = [];
      }
      _meld.splice(meldObjIndex, 1);
    }
    card.destroy();
    this.sortMeldCards(_meld);
    this.meldRearrange(_meld, type);

    return xy;
  }

  showDiscardedCard(data: any, animate: boolean = true) {
    this.playSound('card-draw-discard');
    // this.card_draw_discard.play();

    let tweenDuration = animate ? 50 : 0;

    console.log('discard card####');
    let self = this;
    this.discardedCard = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 2.5,
        data.id
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.discardedCard.setDisplaySize(
      (this.game.scale.width / 40) * 1.82,
      (this.game.scale.width / 40) * 2.64
    );
    this.discardedCard.value = data.value;
    this.discardedCard.id = data.id;
    this.discardedCard.isWild = data.isWild;
    this.discardedCard.visible = true;

    this.discardArray.push(this.discardedCard);
    // console.log('Discard array push', this.discardArray)
    let cardTween = self.tweens.add({
      targets: [self.discardedCard],
      x: (this.game.scale.width / 12.5) * 6.3,
      y: this.game.scale.height / 1.9,
      // scale: 0,
      ease: 'Circ.easeIn',
      duration: tweenDuration,
      yoyo: false,
      angle: 90,
      onComplete(cardTween) {
        cardTween.stop();
      },
    });

    this.discardedCard.on('pointerdown', () => {
      this.discardPileClickAction();
      // if (this.deckCardPicked || (!this.deckCardPicked && this.discardedCardPicked)) {
      //     let id = this.lastPickedCard.id;
      //     let value = this.lastPickedCard.value;
      //     this.modal.gameRoom.send('DISCARD_CARD', { cardId: id });
      //     console.log('the last picked card', this.lastPickedCard);
      // }
      // else if(!this.deckCardPicked) {
      //     this.discardedCardPicked = true;
      //     this.cardpicked = true;
      //     this.modal.gameRoom.send('DRAW_CARD_FROM_DISCARD');
      //     console.log('Draw card from discard');
      //     // this.deckCardPicked = true;
      // }
    });
  }
  playCardAnimation(data: any) {
    switch (data.type) {
      case 'ANIM_DISCARD_TO_HANDS':
        console.log('discard to hand', data);
        if (this.modal.currentTurnSeat == 1) {
        } else {
          let i = 0;
          let _interval = setInterval(() => {
            if (data.cards.length == i) {
              clearInterval(_interval);
              return;
            }
            this.animateDiscardToHand(data.cards[i]);
            i++;
          }, 70);
        }

        break;
    }
  }

  getSeatFromServerIndex(index: number) {
    let seat = 0;
    // console.info("PPPPPPPPPp", this.modal.allPlayers);
    for (let player of this.modal.allPlayers) {
      if (player.index == index) {
        seat = player.seat;
        // console.log('players seat', seat);
        break;
      }
    }
    return seat;
  }

  getPlayerSeatXY(seat: number): any {
    switch (seat) {
      case 1:
        return [
          (this.game.scale.width / 107) * (15.5 + 4),
          (this.game.scale.height / 45) * 43,
        ];
      case 2:
        return [this.game.scale.width / 70, this.game.scale.height / 2.3];
      case 3:
        return [this.game.scale.width / 1.9, this.game.scale.width / 30];
      case 4:
        return [this.game.scale.width / 1.02, this.game.scale.height / 2.3];
    }
    return [0, 0];
  }

  createStockToHandCard(card: any): any {
    this.playSound('card-draw-discard');
    // this.card_draw_discard.play();

    let _card: any = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 2.5,
        card.id
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    // console.log('stock card>>', _card);
    _card.value = card.value;
    _card.id = card.id;
    _card.card = card.card;
    _card.isWild = card.isWild;
    _card.movedUp = false;
    _card.visible = true;
    _card.angle = 90;
    _card.setDepth(1000);
    return _card;
  }

  animateStockToSeat(card: any): any {
    this.playSound('card-draw-discard');
    // this.card_draw_discard.play();
    // console.log('animateStockToSeat seat', this.modal.currentTurnSeat);
    let xy = this.getPlayerSeatXY(Number(this.modal.currentTurnSeat));
    // console.log("XYXYXYX", xy);

    let _card: any = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 2.5,
        'deck'
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );

    _card.value = card.value;
    _card.id = card.id;
    _card.isWild = card.isWild;
    _card.movedUp = false;
    _card.visible = true;
    _card.angle = 90;
    _card.setDepth(1500);

    let tempTween = this.tweens.add({
      targets: [_card],
      x: xy[0],
      y: xy[1],
      ease: 'linear',
      duration: 300,
      yoyo: false,
      angle: 0,
      onComplete: function () {
        tempTween.stop();
        // self.deckCardPicked = true;
        _card.destroy();
        // self.cardpicked = true;
      },
    });
  }

  animateHandsToDiscard(card: any) {
    this.playSound('card-draw-discard');
    // this.card_draw_discard.play();
    let p_index = 0;
    let seat = 0;
    try {
      p_index = Number(card._from.slice(5));
      seat = this.getSeatFromServerIndex(p_index);
    } catch (e) {
      console.error('EEEEEEEEEEEE', e);
      return;
    }

    let xy = this.getPlayerSeatXY(Number(seat));
    // console.log("XYXYXYX", xy, seat, p_index);

    if (this.myPlayingTurn) {
      let _cardIndex = this.cardsArray.findIndex((x: any) => x.id == card.id);
      let playerCard = this.cardsArray[_cardIndex];
      xy = [playerCard.x, playerCard.y];

      // destroyImgIndex = this.cardsArray.findIndex((x: any) => x.id === data.card.id);
      // console.log('destroyed plyers card from hand after discard', _cardIndex)
      this.cardsArray[_cardIndex].destroy();
      // remove card from players hand
      this.cardsArray.splice(_cardIndex, 1);
      // this.arrangeCards();
    }

    let _card: any = this.add
      .image(xy[0], xy[1], card.id)
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );

    _card.value = card.value;
    _card.id = card.id;
    _card.card = card.card;
    _card.isWild = card.isWild;
    _card.visible = true;
    // _card.depth = this.discardArray.length;
    _card.setDepth(1500);
    this.discardArray.push(_card);

    _card.on('pointerdown', () => {
      this.discardPileClickAction();
    });

    this.tweens.add({
      targets: [_card],
      x: (this.game.scale.width / 12.5) * 6.3,
      y: this.game.scale.height / 1.9,
      angle: 90,
      ease: 'Elastic',
      easeParams: [0, 2],
      duration: 800,
      yoyo: false,
      onComplete: function (ct) {
        // self.rearrangePlayerCards(data.card.id, "discard");
        ct.stop();
        // console.log('here is the value of discard', discardedCard);
        // self.cardpicked = true;
      },
    });
  }

  animateToMeld(data: any, side: string, render: boolean = true) {
    this.playSound('automatic-bonus');
    // this.automatic_bonus.play();
    let xy = [0, 0];
    let angle = 0;
    console.log(
      '_MELDCARD',
      data,
      data.value,
      data.cardValue,
      typeof data.cardValue
    );
    // FROM HAND
    if (data._from.includes('HAND')) {
      if (this.myPlayingTurn) {
        let _cardIndex = this.cardsArray.findIndex((x: any) => x.id == data.id);
        if (_cardIndex > -1) {
          let playerCard = this.cardsArray[_cardIndex];
          xy = [playerCard.x, playerCard.y];

          // destroyImgIndex = this.cardsArray.findIndex((x: any) => x.id === data.card.id);
          console.log(
            'destroyed player card from hand after discard',
            _cardIndex
          );
          this.cardsArray[_cardIndex].destroy();
          // remove card from players hand
          this.cardsArray.splice(_cardIndex, 1);
          // this.arrangeCards();
        }
      } else {
        let p_index = 0;
        let seat = 0;
        try {
          p_index = Number(data._from.slice(5));
          seat = this.getSeatFromServerIndex(p_index);
        } catch (e) {
          console.error('EEEEEEEEEEEE', e);
          return;
        }

        xy = this.getPlayerSeatXY(Number(seat));
        // console.log("XYXYXYX", xy, seat, p_index);
      }
    } else {
      // FROM OTHER PLACE
      switch (data._from) {
        case 'STOCK':
          xy = [
            (this.game.scale.width / 12.5) * 6.3,
            this.game.scale.height / 2.5,
          ];
          angle = 90;
          break;

        case 'DISCARD':
          xy = [
            (this.game.scale.width / 12.5) * 6.3,
            this.game.scale.height / 1.9,
          ];
          angle = 90;

          // let dIndx = this.discardArray.findIndex((c: any) => c.id == data.id);
          // console.log("DISCARD CARD USING ", this.discardArray[dIndx])
          // this.discardArray[dIndx].destroy();
          // this.discardArray.splice(dIndx, 1);

          break;
      }
    }

    // console.log("SSSDDDXYXYXYX", xy, side);
    //debugger
    let cardType = this.setCardType(data, side);
    // console.log("SSSDDDXYXYXYX", cardType);

    let _card: any;
    let _meld: any;

    switch (cardType) {
      case 'right':
        _meld = this.modal.rightMeld;

        break;
      case 'rightSpecial':
        _meld = this.modal.specialMeldRight;

        break;

      case 'left':
        _meld = this.modal.leftMeld;
        break;

      case 'leftSpecial':
        _meld = this.modal.specialMeldLeft;

        break;
    }
    _card = this.add
      .image(xy[0], xy[1], data.id)
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );
    _card.id = data.id;
    _card.value = data.value;
    _card.card = data.card;
    _card.angle = angle;

    let index = _meld.findIndex((x: any) => x.value == data.cardValue);
    if (index > -1) {
      const exists =
        _meld[index].meld.findIndex((card: any) => card.id === _card.id) > -1;
      if (!exists) {
        _meld[index].meld.push(_card);
      }
      _meld[index].isCanasta = data.isCanasta;
      _meld[index].isPureCanasta = data.isPureCanasta;
      _meld[index].isCanastaSoundPlayed = false;
    } else {
      let meldObj = {
        value: data.cardValue,
        meld: [_card],
        isCanasta: data.isCanasta,
        isPureCanasta: data.isPureCanasta,
        isCanastaSoundPlayed: false,
      };
      _meld.push(meldObj);
    }
    _card.on(
      'pointerdown',
      (pointer: any, localX: any, localY: any, event: any) => {
        console.info('SETTING POINTER DOWN ', _card);
        this.addCardToExsitingMeld(data.cardValue);
      }
    );
    if (render) {
      this.sortMeldCards(_meld);
      this.meldRearrange(_meld, cardType);
    }
    // this.arrangeCards();
  }

  animateMeldToHand(card: any, side: string) {
    this.playSound('addition-meld');
    // this.addition_meld.play();
    console.log('UNDO_CARD', card);
    card.cardValue = card.referenceMeldValue;
    let type = this.setCardType(card, side);
    let xy = this.calcUndoMeldTarget(card, type);

    // xy = this.getPlayerSeatXY(Number(this.modal.currentTurnSeat));
    // console.log("XYXYXYX", xy);

    let _card: any = this.add
      .image(xy[0], xy[1], card.id)
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );

    _card.value = card.value;
    _card.id = card.id;
    _card.card = card.card;
    _card.isWild = card.isWild;
    _card.movedUp = false;
    _card.visible = true;
    _card.angle = 0;
    _card.setDepth(1000);

    if (this.modal.currentTurnSeat == 1) {
      _card.on(
        'pointerdown',
        (pointer: any, localX: any, localY: any, event: any) => {
          console.info('SETTING POINTER DOWN ', _card);
          this.selectCardFromHand(_card.id);
        }
      );

      this.cardsArray.push(_card);
      this.sortHandCards();
      // this.arrangeCards();
      return _card;
    }

    let destinationXy = [0, 0];

    destinationXy = this.getPlayerSeatXY(Number(this.modal.currentTurnSeat));
    // console.log("UUUUUUXYXYXYX", destinationXy, this.modal.currentTurnSeat);

    let tempTween = this.tweens.add({
      targets: [_card],
      x: destinationXy[0],
      y: destinationXy[1],
      ease: 'linear',
      duration: 300,
      yoyo: false,
      angle: 0,
      onComplete: function () {
        tempTween.stop();
        // self.deckCardPicked = true;
        _card.destroy();
        // self.cardpicked = true;
      },
    });
  }

  animateDiscardToHand(card: any) {
    let cardImageId = this.modal.currentTurnSeat == 1 ? card.id : 'deck';

    let _card: any = this.add
      .image(
        (this.game.scale.width / 12.5) * 6.3,
        this.game.scale.height / 1.9,
        cardImageId
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );

    _card.value = card.value;
    _card.id = card.id;
    _card.card = card.card;
    _card.isWild = card.isWild;
    _card.movedUp = false;
    _card.visible = true;
    _card.angle = 90;
    _card.setDepth(1000);

    // try{
    //     let dIndx = this.discardArray.findIndex((c: any) => c.id == card.id);
    //     this.discardArray[dIndx].destroy();
    //     this.discardArray.splice(dIndx, 1);
    // }catch(e){
    //     console.error(e);
    // }

    // console.log("LLLLLLLL", this.discardArray);

    if (this.modal.currentTurnSeat == 1) {
      _card.on(
        'pointerdown',
        (pointer: any, localX: any, localY: any, event: any) => {
          console.info('SETTING POINTER DOWN ', _card);
          this.selectCardFromHand(_card.id);
        }
      );

      this.cardsArray.push(_card);
      this.sortHandCards();
      // this.arrangeCards();
      return _card;
    }

    let destinationXy = this.getPlayerSeatXY(
      Number(this.modal.currentTurnSeat)
    );
    // console.log("UUUUUUXYXYXYX", destinationXy, this.modal.currentTurnSeat);

    this.tweens.add({
      targets: [_card],
      x: destinationXy[0],
      y: destinationXy[1],
      ease: 'linear',
      duration: 300,
      yoyo: false,
      angle: 0,
      onComplete: function (tween) {
        tween.stop();
        // self.deckCardPicked = true;
        _card.destroy();
        // self.cardpicked = true;
      },
    });
  }

  animateMeldToDiscard(card: any, side: string) {
    //debugger
    if (this.modal.gameRoom.state.turnIndex == this.modal.userServerIndex) {
      this.discardPileHighlighter.visible = true;
      this.stockPileHighlighter.visible = true;
    }

    card.cardValue = card.referenceMeldValue;
    let type = this.setCardType(card, side);
    let xy = this.calcUndoMeldTarget(card, type);

    let _card: any = this.add
      .image(xy[0], xy[1], card.id)
      .setOrigin(0.5, 0.5)
      .setInteractive();
    _card.setDisplaySize(
      (this.game.scale.width / 40) * 1.8,
      (this.game.scale.width / 40) * 2.6
    );

    _card.value = card.value;
    _card.id = card.id;
    _card.card = card.card;
    _card.isWild = card.isWild;
    _card.movedUp = false;
    _card.visible = true;
    _card.angle = 0;
    _card.setDepth(1000);

    _card.on('pointerdown', () => {
      this.discardPileClickAction();
    });
    this.discardArray.push(_card);
    this.discardedCardPicked = false;

    // let depth = this.discardArray.length;

    this.tweens.add({
      targets: [_card],
      x: (this.game.scale.width / 12.5) * 6.3,
      y: this.game.scale.height / 1.9,
      ease: 'linear',
      duration: 300,
      yoyo: false,
      angle: 90,
      onComplete: function (tween, cards) {
        // console.info("TWEEN ", cards);
        // cards[0].setDepth(depth)
        tween.stop();
      },
    });
  }
}
