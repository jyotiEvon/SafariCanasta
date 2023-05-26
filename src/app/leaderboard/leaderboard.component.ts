import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';
import { LocalDbService } from '../services/local-db.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  localData:any;
  me:string='';
  constructor(public model:ModelLocater,private localDb:LocalDbService) { }
  ngOnInit(): void {
    this.localData = this.localDb.getSessionData();
    this.check()
  }

  check(){
    this.me = this.localData.userId;
  }

  






}
