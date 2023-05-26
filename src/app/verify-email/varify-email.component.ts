import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LocalDbService } from '../services/local-db.service';
import { Router } from '@angular/router';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-varify-email',
  templateUrl: './varify-email.component.html',
  styleUrls: ['./varify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  localData: any;
  varifyCode: any;
  errorMsg: string = '';
  showErrorMsg: boolean = false;
  constructor(
    public model: ModelLocater,
    private localDb: LocalDbService,
    private api: ApiService,
    public router: Router,
    public sound:SoundService
  ) {}

  ngOnInit(): void {
    this.localData = this.localDb.getSessionData();
    console.log(
      this.localData,
      'dataSessiondataSession',
      this.localData.userEmail
    );
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }

  verifyEmail(form:any) {
    console.log('_verifyEmail', this.localData.userEmail, form.value.verifycode);
      this.model.showLoader = true;
      this.api
        .verificationCode(this.localData.userEmail,form.value.verifycode)
        .subscribe(
          (res) => {
            console.log('_verifyEmailRes', res);
            this.model.showLoader = false;
            this.router.navigateByUrl('login', { skipLocationChange: false });
          },
          (err: any) => {
            console.log('_errorWhileLogin', err.error.message);
            this.model.showLoader = false;
            this.showErrorMsg = true;
            this.errorMsg = err.error.message;
            setTimeout(() => {
              this.showErrorMsg = false;
            }, 2000);
          }
        );
    
    // else {
    //   this.showErrorMsg = true;
    //   this.errorMsg = 'please enter the code';
    //   setTimeout(() => {
    //     this.showErrorMsg = false;
    //   }, 2000);
    // }
  }
}
