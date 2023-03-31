import { Injectable } from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptorService implements HttpInterceptor {

  constructor( private AuthService:AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
   request = this.AddAuthHeader(request);
   return next.handle(request).pipe(
      (error) => {
        console.log("Error Occured");
        console.log(error);
        return error;
      }
   )

  }
  AddAuthHeader(request: HttpRequest<any>){
    //get the access token from local storage
    const token = this.AuthService.getAccessToken();
    if(token){
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return request;
  }
}
