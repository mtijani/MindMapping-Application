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
    this.router.navigate(['/LoginPage']);
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
  getUserId(){
    return localStorage.getItem('userId');
  }
  signUp(email:string,password:string){
    return this.WebService.signUp(email,password).pipe(
      shareReplay(),
      tap((res:HttpResponse<any>)=>{
        //the auth tokens will be in the header of this response
          this.setSession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'));
          console.log("Signed Up !");
      })
    )
  }
  getNewAccessToken(){
    return this.http.get(`${this.WebService.ROOT_URL}/users/me/access-token`,{
      headers:{
        'x-refresh-token':this.getRefreshToken(),
        '_id':this.getUserId()
      },
      observe:'response'
    }).pipe(
      tap((res:HttpResponse<any>)=>{
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }


}
