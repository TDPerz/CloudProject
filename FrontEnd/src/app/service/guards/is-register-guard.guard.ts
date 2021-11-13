import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsRegisterGuardGuard implements CanActivate {

  constructor(private reRoute:Router, private cookies:CookieService){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.cookies.check('toke')){
      this.reRoute.navigate([''])
      return false;
    }
    return true;
  }
  
}
