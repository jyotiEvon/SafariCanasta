import { Injectable } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  public gameMusic = new Audio();
  public music = new Audio();

  constructor(private model: ModelLocater) {
    var path = this.getMusicPath('backgroundMusic');
    this.music.src = path;
    this.music.load();
   
  }
  startGameSound(name: any) {
    console.log('_soundStatus' + this.model.gameSoundSetting);
    if (this.model.gameSoundSetting) {
      let path = this.getMusicPath(name);
      this.gameMusic.src = path;
      this.gameMusic.play();
    } else {
      this.stopSound();
    }
  }

  stopSound() {
    console.log("_pauseMusic")
    this.gameMusic.pause();
    this.music.pause();
   
  }
  setMusic() {
    console.log('_musicStatus' + this.model.musicSetting);
    if (this.model.musicSetting) {
      this.music.play();
      this.music.loop = true;
    } else {
      this.music.pause();
    }
  }

  getMusicPath(name: any) {
    let path: any;
    for (let i in this.model.soundObj) {
      console.log(
        'play music name >>>>>>',
        name,
        ' music >>>>>>>',
        this.model.soundObj[i].code
      );
      if (name == this.model.soundObj[i].code) {
        path = this.model.soundObj[i].path;
        break;
      }
    }
    return path;
  }
}
