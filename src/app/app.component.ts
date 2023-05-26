import { Component } from '@angular/core';
import { SoundService } from './services/sound.service';
import { ModelLocater } from './modelLocater/modelLocater';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'safaricanasta';
  constructor(private sound:SoundService, private modal:ModelLocater){
    document.addEventListener("pause", () => {
      this.modal.musicSetting = false;
      this.sound.setMusic();
    });
    //To run code when the app is restored to the foreground
    document.addEventListener("resume", () => {
      this.modal.musicSetting = true;
      this.sound.setMusic();
    });
    // document.addEventListener('backbutton', self.sound.setMusic);
  }
}
