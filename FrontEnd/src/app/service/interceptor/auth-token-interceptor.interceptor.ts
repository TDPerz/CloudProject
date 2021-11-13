import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from '../Api/back-end.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private cookie:CookieService, private auth:BackEndService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url === 'http://api.cloudinary.com/v1_1/sekaijk/image/upload'){
      return next.handle(request)
    }
    else{
      const token = this.auth.getToken()
      let req = request
      if(token){
        req = request.clone({
          setHeaders:{
            'autho': `Bearer ${token}` 
          }
        })
      }
      return next.handle(req)
    }
  }
}
