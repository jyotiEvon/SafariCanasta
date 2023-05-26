import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { LocalDbService } from '../services/local-db.service';
import { Router } from '@angular/router';
import { AbstractControl,ValidatorFn,ValidationErrors } from '@angular/forms';
import { SoundService } from '../services/sound.service';

interface User{
  varifyCode:string,
  newPassword:string,
  confirmPassword:string
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  localData: any;
  user:User={
    varifyCode: '',
    newPassword: '',
    confirmPassword:''
  }
  showErrorMsg: boolean = false;
  errorMsg: string = '';
  

  constructor(
    public model: ModelLocater,
    private localDb: LocalDbService,
    private api: ApiService,
    public router: Router,
    public sound:SoundService
  ) {}

  ngOnInit(): void {
    this.localData = this.localDb.getUserEmail();
    console.log(
      this.localData,
      'Sessiondata',
      this.localData.userEmail
    );
  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }

  getUserName(event: any) {
    this.model.userName = event.target.value;
  }

  resetPassword(form:any):any {
    // let isEmpty = (this.localData.userEmail != ''&& form.value.verifyCode != '',
    // form.value.confirmPassword != ''?false:true);
    let matchPassword = form.value.newPassword === form.value.confirmPassword?true:false;
    
    console.log('isValidate',matchPassword)
    if(!matchPassword){
      this.showErrorMsg = true;
      this.errorMsg = "Password does not match";
      setTimeout(() => {
        this.showErrorMsg = false;
      }, 4000);
      return 0;
    }

    // if(isEmpty) {
    //   this.showErrorMsg = true;
    //   this.errorMsg = "Fields can't be empty";
    //   setTimeout(() => {
    //     this.showErrorMsg = false;
    //   }, 4000);
      
    //   return 0;
    // }
    
   
      this.model.showLoader = true;
      console.log(
        '_resetData',this.localData.userEmail,form.value.verifyCode,form.value.confirmPassword);
      this.api
        .resetPassword(
          this.localData.userEmail,
          form.value.verifyCode,
          form.value.confirmPassword
        )
        .subscribe(
          (res: any) => {
            console.log('resetPasswordRes', res);
            this.model.showLoader = false;
            this.router.navigateByUrl('login', {
              skipLocationChange: false,
            });

            this.localDb.removeStorage();
          },
          (err) => {
            console.log('_errResetPaswd', err);
            this.model.showLoader = false;
            this.showErrorMsg = true;
            this.errorMsg = err.error.message;

            setTimeout(() => {
              this.showErrorMsg = false;
            }, 4000);
          }
        );

        return 0;
    }
     
  }

