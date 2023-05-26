import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';

@Component({
  selector: 'app-winscreen',
  templateUrl: './winscreen.component.html',
  styleUrls: ['./winscreen.component.scss']
})
export class WinscreenComponent implements OnInit {
  myTeamFinishedPoints:number = 0;
  myTeamHandCardsPoints:number = 0;
  myTeamMeldedCardsPoints:number = 0;
  myTeamNaturalCanastasPoints:number = 0;
  myTeamMixedCanastasPoints:number = 0;
  myTeamAcesCanastasPoints:number = 0;
  myTeamSevensCanastasPoints:number = 0;
  myTeamWildsCanastasPoints:number = 0;
  myTeamSpecialCanastasPoints:number = 0;
  myTeamScore:number = 0;
  myCommulativeScore:number = 0

  rivalsFinishedPoints:number = 0;
  rivalsHandCardsPoints:number = 0;
  rivalsMeldedCardsPoints:number = 0;
  rivalsNaturalCanastasPoints:number = 0;
  rivalsMixedCanastasPoints:number = 0;
  rivalsAcesCanastasPoints:number = 0;
  rivalsEvensCanastasPoints:number = 0;
  rivalsWildsCanastasPoints:number = 0;
  rivalSpecialCanastasPoints:number = 0;
  rivalsTeamScore:number = 0;
  rivalsCommulativeScore:number = 0

  protected gamePlaySubscriptions: Subscription[] = [];
  constructor(public modal:ModelLocater) { 
    // this.subscribeToEvents();
  }

  ngOnInit(): void {

  }

}




