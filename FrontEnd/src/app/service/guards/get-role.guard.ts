import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { BackEndService } from '../Api/back-end.service';

@Injectable({
  providedIn: 'root'
})
export class GetRoleGuard implements CanActivate {
  
  constructor(private authService:BackEndService, private route:Router, private jwt:JwtHelperService, private cookies:CookieService){}

  canActivate(): boolean{
    var token = this.jwt.decodeToken(this.authService.getToken());
    console.log(token)
    if(token.role !== "Admin"){
      return false
    }
    return true
  }
  
}
