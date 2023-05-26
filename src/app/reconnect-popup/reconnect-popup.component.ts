import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Component({
  selector: 'app-reconnect-popup',
  templateUrl: './reconnect-popup.component.html',
  styleUrls: ['./reconnect-popup.component.scss']
})
export class ReconnectPopupComponent implements OnInit {
  public dotsText = ".";

  constructor(public model: ModelLocater) {
    setInterval(() => {
      if (this.dotsText.length == 3) {
        this.dotsText = "";
      }
      this.dotsText += ".";
    }, 1000);
  }

  ngOnInit(): void {
  }

}
