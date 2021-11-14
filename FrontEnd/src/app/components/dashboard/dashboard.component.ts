import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  option:string="Dashboard"
  user:string=""
  isCollapse=true;
  isResp = false;
  isColDrawer=false;
  position:NzPlacementType = 'topCenter'

  constructor(private route:Router, jwt:JwtHelperService, private cookie:CookieService, private backEnd:BackEndService) {
    this.user = (jwt.decodeToken(backEnd.getToken())).user
    if(window.innerWidth < 720){
      this.isCollapse = true;
    }
    else{
      this.isCollapse = false;
    }
  }

  ngOnInit(): void {
    if(window.innerWidth < 720){
      this.isCollapse = true;
    }
    else{
      this.isCollapse = false;
    }
  }

  logOut(){
    if(this.cookie.check('token')){
      this.cookie.delete("token")
    }
    else{
      sessionStorage.removeItem('token')
    }
    this.route.navigate(['/login'])
  }

  selectConten(o:string){
    this.option = o;
  }

  closeSlide(coll:boolean){
    if(this.isResp){
      this.isColDrawer = coll;
    }
    else{
      this.isCollapse = coll;
    }
  }

  getToken(a:any){
    this.user = a.user
  }

  @HostListener('window:resize', ['$event'])
  
  onResize(event:any) {
    if(window.innerWidth < 768){
      this.isResp = true;
    }
    else{
      this.isResp = false;
    }
  }

}
