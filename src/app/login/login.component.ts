import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { SoundService } from '../services/sound.service';
import { Router } from '@angular/router';
import { LocalDbService } from '../services/local-db.service';
interface User{
  username:string,
  password:string,
  showPassword:boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user:User={
    username: '',
    password: '',
    showPassword:false,
  }
 
  localData: any;
  errorMsg: string = '';
  showErrorMsg: boolean = false;
  constructor(
    public model: ModelLocater,
    public sound: SoundService,
    public api: ApiService,
    private router: Router,
    public localDb: LocalDbService
  ) {}

  ngOnInit(): void {
    this.localData = this.localDb.getSessionData();
    console.log(this.localData, 'dataSessiondataSession');
    if (this.localData.accessToken) {
      if (this.localData.userName.length > 0) {
        console.log(this.localData, 'dataSessiondataSession');
        this.model.userId = this.localData.userId;
        this.model.userName = this.localData.userName;
        this.model.accessToken = this.localData.accessToken;
        this.model.avatar = this.localData.avatar;
        this.model.email = this.localData.userEmail;
        this.router.navigateByUrl('landing');
      }
    }
  }

 
  login() {
    this.startSound();
    let data;
    console.log('_loginDetails', this.user.username, this.user.password);

    if (this.user.username != null &&this.user.password != null) {
      this.model.showLoader = true;

      this.api.login(this.user.username,this.user.password).subscribe(
        (res: any) => {
          console.log('_loginResponse', res);
          this.model.showLoader = false;

          if (res.message == 'Logged in successfully.') {
            this.model.userId = res.data.user.id;
            this.model.userName = res.data.user.username;
            this.model.avatar = res.data.user.avatar;
            this.model.email = res.data.user.email;
            this.model.accessToken = res.data.token;
            this.model.defeats = res.data.career.defeats;
            this.model.gems = res.data.career.gems;
            this.model.handsLost = res.data.career.hands_lost;
            this.model.handsWon = res.data.career.hands_won;
            this.model.handsPlayed = res.data.career.hands_played;
            this.model.highestScore = res.data.career.highest_score;
            this.model.unfinishedGames = res.data.career.unfinished_games;

            console.log(
              'LOGIN_DETAILS',
              this.model.userId,
              this.model.userName,
              this.model.accessToken
            );

            data = {
              userId: this.model.userId,
              userName: this.model.userName,
              userEmail: this.model.email,
              accessToken: this.model.accessToken,
              avatar: this.model.avatar,
              gems:  this.model.gems 
            };
            this.localDb.setUserData(data);
            this.router.navigateByUrl('landing', { skipLocationChange: false });
          }
        },
        (err) => {
          console.log('_loginError', err.error.message);
          this.model.showLoader = false;
          this.showErrorMsg = true;
          this.errorMsg = err.error.message;
          setTimeout(() => {
            this.showErrorMsg = false;
          }, 2000);
          console.log('_loginError', this.errorMsg);
        }
      );
    } else {
      this.showErrorMsg = true;
      this.errorMsg = "Fields can't be empty";
      setTimeout(() => {
        this.showErrorMsg = false;
      }, 2000);
    }
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }
}
