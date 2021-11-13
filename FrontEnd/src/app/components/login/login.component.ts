import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup
  afUrl = '';

  constructor(private fb:FormBuilder,private route:Router, private backEnd:BackEndService, private cookie:CookieService, private rou:ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password : new FormControl('', [Validators.required]),
      remember:[false]
    })
  }

  ngOnInit(): void {
    this.afUrl = this.rou.snapshot.queryParams['returnUrl'] || '/'
    console.log(this.afUrl)
  }

  getEmailError(){
    if (this.loginForm.controls['email'].hasError('required')) {
      return 'Require email';
    }
    if(this.loginForm.controls['email'].hasError('emailIncorrect')){
      return "Email incorrect"
    }
    return this.loginForm.controls['email'].hasError('email') ? 'Email not valid' : '';
  }

  getPasswordError(){
    if(this.loginForm.controls['password'].hasError('passwordIncorrect')){
      return "Password incorrect"
    }
    return this.loginForm.controls['password'].hasError('required') ? 'Require password' : '';
  }

  login(){
    this.backEnd.login(this.loginForm.value).subscribe(x=>{
      if(x.Status == 0){
        if(this.loginForm.value.remember){
          this.cookie.set('token', x.Token)
        }
        else{
          sessionStorage.setItem('token', x.Token)
        }
        this.route.navigate([this.afUrl])
      }
      else{
        if(x.Mensaje === "Usuario no encontrado"){
          this.loginForm.controls['email'].setErrors({'emailIncorrect': true})
        }
        if(x.Mensaje === "Contraseña no correcta"){
          this.loginForm.controls['password'].setErrors({'passwordIncorrect':true})
        }
      }
    })
  }

}
