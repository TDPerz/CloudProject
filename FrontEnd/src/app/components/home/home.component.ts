import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  active=false;
  isCollapse = false;
  isAdmin = true;
  NavTitle = 'Empresa'
  user:any // [] - 'asfsd' 

  constructor(private cookie:CookieService, private jwt:JwtHelperService, private route:Router, private backEnd:BackEndService) {
    var token = jwt.decodeToken(backEnd.getToken()) // {User: Deivid, correo:sfwfs, role:Admin}
    this.user = token
    if(this.user != null){
      if(this.user.role == 'Admin'){
        this.isAdmin = false
      }
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

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    if(window.innerWidth < 768){
      this.isCollapse = true;
    }
    else{
      this.isCollapse = false;
    }
  }

  goTo(url:string){
    this.route.navigateByUrl(url)
  }

  logOut(){
    if(this.cookie.check('token')){
      this.cookie.delete("token")
    }
    else{
      sessionStorage.removeItem('token')
    }
    this.route.navigate([''])
    window.location.reload()
  }

}
