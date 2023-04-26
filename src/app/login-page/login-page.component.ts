import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService ,router:Router) { }

  ngOnInit(): void {
  }
  onLoginButtonClicked(email:string, password:string) {
    this.authService.login( email, password).subscribe((res:HttpResponse<any>) => {
      console.log(res);

    });

  }

  onSignUpClicked(email:string, password:string) {
    this.authService.signUp(email, password).subscribe((res:HttpResponse<any>) => {
      console.log(res);
    });
}

}
