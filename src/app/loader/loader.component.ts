import { Component, OnInit } from '@angular/core';
import { ModelLocater } from '../modelLocater/modelLocater';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(public model:ModelLocater) { }

  ngOnInit(): void {
  }

}
