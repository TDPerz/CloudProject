import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzResultStatusType } from 'ng-zorro-antd/result';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-active-account',
  templateUrl: './active-account.component.html',
  styleUrls: ['./active-account.component.scss']
})
export class ActiveAccountComponent implements OnInit {

  loading=true;
  status = 'Comprobando su identidad'
  contentStatus = 'Estamos verificando su identidad, terminara pronto...'
  icono = 'loading'

  constructor(private cookies:CookieService,private backEnd: BackEndService,private route:Router, private act:ActivatedRoute, private jwt: JwtHelperService) {
    // let token = this.act.snapshot.paramMap.get('token') || ''
    // if(!jwt.isTokenExpired(token)){
    //   this.backEnd.activeAccount(token).subscribe(x=>{
    //     if(x.Status == 0){
    //       console.log("Todo Listo!!!")
    //       this.loading = false
    //       this.status = "Identidad Confirmada"
    //       this.icono = 'check-circle'
    //       this.contentStatus= "Cuenta ya creada!"
    //       cookies.set('token', x.Token)
    //     }
    //   })
    // }
    // else{
    // }
  }

  ngOnInit(): void {
  }

}
