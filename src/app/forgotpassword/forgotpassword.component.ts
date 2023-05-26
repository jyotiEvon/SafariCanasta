import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { LocalDbService } from '../services/local-db.service';

interface User{
  email:string;
}

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  userEmail: string='';
  errorMsg: string = '';
  showErrorMsg: boolean = false;
  user:User={
    email:''
  }
  
  constructor(
    public model: ModelLocater,
    private api: ApiService,
    public router: Router,
    public localDb: LocalDbService
  ) {}

  ngOnInit(): void {}

 
  verifyEmail() {
    let data:any;
    console.log('_emailVerify', this.user.email);
    if (this.user.email != '') {
      this.model.showLoader = true;
      this.api.verifyEmail(this.user.email).subscribe(
        (res: any) => {
          console.log('_verifyEmailRes', res);
          this.model.showLoader = false;
          data = {
            userEmail: this.user.email,
          };
          this.localDb.setUserEmail(data);
          this.router.navigateByUrl('resetpassword', {
            skipLocationChange: false,
          });
        },
        (err: any) => {
          console.log('_verifyEmailError', err.error.message);
          this.model.showLoader = false;
          this.showErrorMsg = true;
          this.errorMsg = err.error.message;
          setTimeout(() => {
            this.showErrorMsg = false;
          }, 4000);
        }
      );
    } else {
      this.showErrorMsg = true;
      this.errorMsg = "Enter you email address";
      setTimeout(() => {
        this.showErrorMsg = false;
      }, 4000);
    }
  }
}