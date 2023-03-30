import { Component, ViewChild, ElementRef } from '@angular/core';




@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent  {
  @ViewChild('blob1', { static: true }) blob1: ElementRef;
  @ViewChild('blob2', { static: true }) blob2: ElementRef;
  constructor() { }


}
