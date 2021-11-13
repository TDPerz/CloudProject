import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackEndService } from '../Api/back-end.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {

  constructor(private authService:BackEndService, private route:Router){}

  canActivate(router: ActivatedRouteSnapshot, state:RouterStateSnapshot): boolean{
    console.log(state.toString())
    if(!this.authService.auth()){
      this.route.navigate(['login'], {queryParams:{returnUrl: state.url}})
      return false
    }
    return true
  }
  
}
