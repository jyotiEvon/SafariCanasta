import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameComponent } from '../game/game.component';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';
import { LocalDbService } from '../services/local-db.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public isCollapsed = true;
  public isCollapsed1 = true;
  public isInfoCollapse = true;
  public showInfo = false;
  // public gameSound = true;
  // public bgMusic = true;
  localDataBgMusic:any
  localDataGameSound:any;

  constructor(
    public gameComp: GameComponent,
    public model: ModelLocater,
    public sound: SoundService,
    private modalService: NgbModal,
    private localDb: LocalDbService
  ) {}

  ngOnInit(): void {
    
    this.localDataBgMusic = this.localDb.getBackgroundMusic();
    this.model.musicSetting = this.localDataBgMusic.sound
    console.log('_bgMusicSetting',this.localDataBgMusic.sound,this.model.musicSetting);
    this.localDataGameSound = this.localDb.getGameSound();
    this.model.gameSoundSetting =  this.localDataGameSound.sound
    console.log('_gameSoundSetting',this.localDataGameSound.sound, this.model.gameSoundSetting );
  }

  openInfo(content: any) {
    this.modalService.open(content, {
      fullscreen: true,
      modalDialogClass: 'dark-modal',
    });
  }

  chatText(data: string) {
    console.log('chat_text', data);
    this.model.gameRoom.send('CHAT', { text: data });
    this.isCollapsed1 = !this.isCollapsed1;
  }
  chatEmoji(data: string) {
    console.log('chat_emoji', data);
    this.model.gameRoom.send('CHAT', { emoji: data });
    this.isCollapsed1 = !this.isCollapsed1;
  }
  quitGame() {
    this.gameComp.leaveGame();
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }

  stopMusic() {
    this.sound.stopSound();
  }

  startMusic() {
    this.sound.setMusic();
  }

  checkGameSound() {
    let data
    this.model.gameSoundSetting = !this.model.gameSoundSetting;
    data={
      sound:this.model.gameSoundSetting,
    };
   console.log('_gameSound', data.sound);
   this.localDb.setGameSound(data);
  }

  checkBgMusic() {
    let data;
    this.model.musicSetting = ! this.model.musicSetting;
    data={
      sound:this.model.musicSetting,
    };
    console.log('_bgMusic', data.sound)
    this.localDb.setBackgroundMusic(data);
    this.sound.setMusic();
  }
}
