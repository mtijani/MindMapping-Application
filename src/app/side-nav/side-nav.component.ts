import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {


  isExpanded: boolean = false;
  userIsAuthenticated = false;



    name='';
  constructor() { }

  ngOnInit(): void {



  }

}
