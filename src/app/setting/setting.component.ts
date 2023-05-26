import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';
import { LocalDbService } from '../services/local-db.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss',  '../landing/landing.component.scss']
})
export class SettingComponent implements OnInit {
  localDataBgMusic:any
  localDataGameSound:any;
  setMusic:any

  constructor(public sound:SoundService,public model:ModelLocater,private localDb:LocalDbService) { }

  ngOnInit(): void {
    
    this.localDataBgMusic = this.localDb.getBackgroundMusic();
    this.model.musicSetting = this.localDataBgMusic.sound
    console.log('_bgMusicSetting',this.localDataBgMusic.sound,this.model.musicSetting);
    this.localDataGameSound = this.localDb.getGameSound();
    this.model.gameSoundSetting =  this.localDataGameSound.sound
    console.log('_gameSoundSetting',this.localDataGameSound.sound, this.model.gameSoundSetting );
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

  checkBgMusic(){
    let data;
    this.model.musicSetting = ! this.model.musicSetting;
    data={
      sound:this.model.musicSetting,
    };
    console.log('_bgMusic', data.sound)
    this.localDb.setBackgroundMusic(data);
    this.sound.setMusic();
  }

  startSound(sound:any){
  this.sound.startGameSound('backgroundMusic');
  }

}
