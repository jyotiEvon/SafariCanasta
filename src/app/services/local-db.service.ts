import { Injectable } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Injectable({
  providedIn: 'root',
})
export class LocalDbService {
  session_id: any = {};
  user_email: any = {};
  bg_music:any={};
  game_sound:any={};
   localDataBgMusic:any;
  localDataGameSound:any;

  constructor(public model: ModelLocater) {
    this.localDataBgMusic = this.getBackgroundMusic();
    this.model.musicSetting = this.localDataBgMusic.sound
    console.log('_bgMusicSetting',this.localDataBgMusic.sound,this.model.musicSetting);
    this.localDataGameSound = this.getGameSound();
    this.model.gameSoundSetting =  this.localDataGameSound.sound
    console.log('_gameSoundSetting',this.localDataGameSound.sound, this.model.gameSoundSetting);
  }

  setUserData(data: any) {
    this.session_id = {
      userId: data.userId,
      userName: data.userName,
      accessToken: data.accessToken,
      userEmail: data.userEmail,
      avatar: data.avatar,
      gems: data.gems,
    };
    console.log(this.session_id, 'this.session_id');
    localStorage.setItem('SessionDb', JSON.stringify({ id: this.session_id }));
  }

  public getSessionData() {
    let arr = Array();
    var a: any = localStorage.getItem('SessionDb');
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.id;
  }

  setUserEmail(data: any) {
    this.user_email = { userEmail: data.userEmail };
    console.log(this.user_email, 'this.user_email');
    localStorage.setItem(
      'userEmail',
      JSON.stringify({ email: this.user_email })
    );
  }

  public getUserEmail() {
    let arr = Array();
    var a: any = localStorage.getItem('userEmail');
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.email;
  }

  public setBackgroundMusic(data:any){

    this.bg_music = {sound:data.sound};
    console.log(this.bg_music,'setBgM');
    localStorage.setItem(
      'backGroundMusic',
      JSON.stringify({bgMusic: this.bg_music })
    )
  }

  public getBackgroundMusic(){
    let arr = Array();
    var a:any = localStorage.getItem('backGroundMusic');
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? {sound:this.model.musicSetting} : localStorageItem.bgMusic;
  }

  public setGameSound(data:any){
    console.log('_setGameSound',data)
    this.game_sound = {sound:data.sound};
    console.log(this.game_sound);
    localStorage.setItem(
      'gameSound',
      JSON.stringify({gameSound: this.game_sound })
    )
  }

  public getGameSound(){
    let arr = Array();
    var a:any = localStorage.getItem('gameSound');
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? {sound:this.model.gameSoundSetting} : localStorageItem.gameSound;
  }

  removeStorage() {
    localStorage.clear();
  }
}
