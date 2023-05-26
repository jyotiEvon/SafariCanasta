import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SoundService } from '../services/sound.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Textures } from 'phaser';
import { ApiService } from '../services/api.service';
import { LocalDbService } from '../services/local-db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../landing/landing.component.scss']
})
export class ProfileComponent implements OnInit {
path:any = '/assets/img/users/lion.png';
updateusername:string='';
editable:boolean = false;
localData:any
// profileClicked:boolean = false;
avartarProfile:any
profileClicked:boolean[] = [false,false,false,false,false,false,false,false]

  constructor(public model:ModelLocater, public sound:SoundService, private modalService: NgbModal,private api:ApiService,private localDb:LocalDbService) { }
  // @ViewChild('profile') landing:ProfileComponent | undefined;

  ngOnInit(): void {
    this.localData = this.localDb.getSessionData();

  }

  startSound() {
    this.sound.startGameSound('btnSound');
  }

  editDetails(){
    this.model.editProfile = true;
  }

  selectedProfile(id:number){
    for(let i = 0;i<this.profileClicked.length;i++){
      if(i == id){
        this.profileClicked[i] = true
      }
      else{
        this.profileClicked[i] = false

      }
    }
    // this.selectedProfileArray
  }

  updateProfile(src:string):void|undefined{
    // this.profileClicked =   !this.profileClicked;
    console.log('selectProfile',this.localData.accessToken);
    this.model.showLoader = true;
    this.path = src;
    this.avartarProfile = this.path ;

    console.log('_SRC',this.path)
     this.api.updateProfile(this.localData.accessToken,this.avartarProfile,this.model.userName).subscribe(res=>{
      console.log('_updateProfileRes',res);
      this.model.showLoader = false;
      this.model.avatar  = res.data.user.avatar;
      this.model.userName = res.data.user.username;
      this.model.email = res.data.user.email;
      // this.model.editProfile = false;
      // this.model.selectProfile( this.model.avatar);
      // profile.selectProfile(this.model.avatar)
     
    },(err)=>{
      console.log('_ErrorUpdaterofile',err);
      this.model.showLoader = false;

    })

  }

  getProfilePath(name:string){
    let path:any;
    for(let i in this.model.profileObj){
      // console.log('_profileName',name,'_profileSrc',this.model.profileObj[i].name);
      if(name == this.model.profileObj[i].name){
        path = this.model.profileObj[i].path;
        break;
      }
    }
    return path;

  }

  // public getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }



}
