import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    isExpanded: boolean = false;
  userIsAuthenticated = false;
  title = 'Myproject';

  constructor() { }

  ngOnInit(): void {
  }

}
