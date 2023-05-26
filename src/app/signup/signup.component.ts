import { Component, OnInit } from '@angular/core';
import { SoundService } from '../services/sound.service';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { LocalDbService } from '../services/local-db.service';

interface User {
  email: string;
  username: string;
  password: string;
  showPassword:boolean;

}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  errorMsg: string = '';
  user: User = {
    email: '',
    username: '',
    password: '',
    showPassword:false
  };
  showText:boolean = false
  showErrorMsg: boolean = false;

  constructor(
    public model: ModelLocater,
    public sound: SoundService,
    public api: ApiService,
    public router: Router,
    private localDb: LocalDbService
  ) {}

  ngOnInit(): void {
  
  }

  validateForm(isInvalid:any){
    console.log('_IS_INVALIDATE',isInvalid)
   this.showText = isInvalid?true:false;
   if(!this.showText) return;
   if(this.showText){
    setTimeout(() => {
      this.showText = false
    }, 1000);
   }
  }
 
  registerUser(isInvalid: any) {
    let data;
    console.log('form data', this.user.username, this.user.email,this.user.password);
  
    if(!isInvalid){
      this.model.showLoader = true;
      this.api
        .registerApi(
          this.user.email,
          this.user.password,
          this.user.username,
          '/assets/img/users/lion.png'
        )
        .subscribe(
          (res: any) => {
            console.log('_registResponse ', res);
            this.model.showLoader = false;
            this.model.userId = res.data.user.id;
            this.model.userName = res.data.user.username;
            this.model.email = res.data.user.email;
            this.model.avatar = res.data.user.avatar;

            console.log(
              'REGIS_DETAILS',
              this.model.userId,
              this.model.userName,
              this.model.accessToken
            );

            data = {
              userId: this.model.userId,
              userName: this.model.userName,
              userEmail: this.model.email,
              accessToken: this.model.accessToken,
            };

            this.localDb.setUserData(data);
            this.router.navigateByUrl('verifyemail', {
              skipLocationChange: false,
            });
          },
          (err) => {
            console.log('_signUPError', err.error.message);
            this.model.showLoader = false;
            this.showErrorMsg = true;
            this.errorMsg = err.error.message;
            console.log('_signUPError', this.errorMsg);
            setTimeout(() => {
              this.showErrorMsg = false;
            }, 2000);
          }
        );
    }
      
    
  }
  startSound() {
    this.sound.startGameSound('btnSound');
  }
}
