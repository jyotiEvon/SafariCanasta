import { Component, Input, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  progressBar: any = 0;
  

  @Input() progressValue:number = 0
  @Input() progressVehicle:number = 0

  constructor(public model: ModelLocater) {}
  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
     let interval = setInterval(() => {
      if (this.model.phaserProgressValue == 1) {
        clearInterval(interval);
      }
     
      this.progressValue= Math.floor(this.model.phaserProgressValue * 100) ;
      this.progressVehicle= Math.floor(this.model.phaserProgressValue * 100) ;
      this.progressBar = Math.floor(this.model.phaserProgressValue * 100) + '%';

    },10);

  }
}
