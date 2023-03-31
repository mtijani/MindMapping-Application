import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import {WebRequestService} from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay,tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private WebService: WebRequestService, private router: Router) { }

  login(email:string,password:string){
  return this.WebService.login(email,password).pipe(
      shareReplay(),
      tap((res:HttpResponse<any>)=>{
        //the auth tokens will be in the header of this response
         this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
         console.log("Logged IN !");

      })
    )
  }
  logout(){
    this.removeSession();
  }
  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }
  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }
  setAccessToken(accessToken:string){
    localStorage.setItem('x-access-token',accessToken);
  }

  private setSession(userId:string,accessToken:string,refreshToken:string){
    localStorage.setItem('userId',userId);
    localStorage.setItem('x-access-token',accessToken);
    localStorage.setItem('x-refresh-token',refreshToken);
  }
  private removeSession(){
    localStorage.removeItem('userId');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }


}
