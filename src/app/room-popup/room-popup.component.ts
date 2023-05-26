import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Component({
  selector: 'app-room-popup',
  templateUrl: './room-popup.component.html',
  styleUrls: ['./room-popup.component.scss']
})
export class RoomPopupComponent implements OnInit {

  constructor(public modal:ModelLocater) { }

  ngOnInit(): void {
  }

}
