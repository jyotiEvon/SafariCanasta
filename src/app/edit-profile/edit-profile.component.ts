import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { ApiService } from '../services/api.service';
import { LocalDbService } from '../services/local-db.service';

interface User {
  username: string;
  oldPassword: string;
  newPassword: string;
 

}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: User = {
    username: this.model.userName,
    oldPassword:'',
    newPassword:''
   
  };
  // username: string = this.model.userName;
  errorMsg: string = '';
  showErrorMsg: boolean = false;
  btnClicked: boolean[] = [false, false];
  selected: any;
  localData:any={}
  
  constructor(public model: ModelLocater, private api: ApiService,private localDb:LocalDbService) {}

  ngOnInit(): void {
    this.localData = this.localDb.getSessionData();

  }

  closePoup() {
    this.model.editProfile = false;
  }
  isClicked(id: number) {
    for (let i = 0; i < this.btnClicked.length; i++) {
      if (i == id) {
        this.btnClicked[i] = true;
      } else {
        this.btnClicked[i] = false;
      }
    }
  }
  saveDetails() {
    this.model.showLoader = true;
    this.model.profileSrc = this.model.avatar;
    console.log('this.model.profileSrc',this.localData.accessToken, this.model.profileSrc, this.user.username,this.user.oldPassword,this.user.newPassword);
    console.log('_EDITPROFILE',this.user.username,this.user.oldPassword,this.user.newPassword)
    this.api.updateProfile(
      this.localData.accessToken,
        this.model.profileSrc,
        this.user.username,
        this.user.oldPassword,
        this.user.newPassword
      ).subscribe(
        (res) => {
          console.log('_updateProfileRes',res);
          this.model.showLoader = false;
          this.model.avatar = res.data.user.avatar;
          this.model.userName = res.data.user.username;
          this.model.email = res.data.user.email;
          this.model.editProfile = false;
        },
        (err) => {
          console.log('_errorInEditProfile',err.error.message);
          this.model.showLoader = false;
          this.showErrorMsg = true;
          this.errorMsg = err.error.message;
          setTimeout(() => {
            this.showErrorMsg = false;
          }, 4000);
        }
      );
  }
}
