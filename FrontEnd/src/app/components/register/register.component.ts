import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { timer } from 'rxjs';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup
  tokenInput:FormGroup
  isActivate = false;
  loading=true;
  status = 'Comprobando su identidad'
  contentStatus = 'Estamos verificando su identidad, terminara pronto...'
  icono = 'loading'
  confirm = false
  tokenValue = ''
  IsTokenError = true
  timeLeft:number = 600
  currentTime ={minutes:0,seconds:0}
  interval : any
  subscribeTimer: any
  isTimer = true;
  isFail = false;
  
  // @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  constructor(private fb:FormBuilder, private route:Router, private backEnd:BackEndService, private cookie:CookieService) {
    this.registerForm = this.fb.group({
      user: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password : new FormControl('', [Validators.required]),
      checkPassword: new FormControl('',[Validators.required, this.confirmationValidator])
    })
    this.tokenInput = this.fb.group({
      token: new FormControl('',[Validators.required, Validators.max(9999)])
    })
  }

  ngOnInit(): void {
  }

  oberserableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.currentTime = this.getTime(this.timeLeft)
      } else {
        clearInterval(this.interval);
        this.tokenValue = ''
        this.isTimer = false
        this.isFail = true;
        this.icono = "close-circle"
        this.status = "Error"
        this.contentStatus = "Vuelva recarge el token!"
      }
    },1000)
  }

  getTime(time:number){
    var minutes = Number((time/60).toString().split('.')[0])
    var seconds = time%60
    return {minutes, seconds}
  }

  getEmailError(){
    if (this.registerForm.controls['email'].hasError('required')) {
      return 'Se necesita un Email';
    }
    if(this.registerForm.controls['email'].hasError('emailIncorrect')){
      return "Email incorrecto"
    }
    return this.registerForm.controls['email'].hasError('email') ? 'Email no es valido' : '';
  }

  getPasswordError(){
    if(this.registerForm.controls['password'].hasError('passwordIncorrect')){
      return "Contraseña incorrect"
    }
    return this.registerForm.controls['password'].hasError('required') ? 'Se necesita una contraseña' : '';
  }

  getCheckPasswordError(){
    if(this.registerForm.controls['checkPassword'].hasError('confirm')){
      return 'Contraseña no coincide'
    }
    return this.registerForm.controls['checkPassword'].hasError('required') ? 'se necesita confirmar su contraseña' : ''
  }

  register(){
    // this.backEnd.activeAccount(this.registerForm.controls['email'].value).subscribe(x=>{
    //   if(x.Status == 0){
    //     this.isActivate = true;
    //     this.tokenValue = x.Token;
    //     this.currentTime = this.getTime(this.timeLeft)
    //     this.startTimer()
    //   }
    // })
    this.backEnd.register(this.registerForm.value).subscribe(x=>{
        if(x.Status == 0){
          this.confirm = false
          sessionStorage.setItem('token', x.Token)
          this.icono = 'check-circle'
          this.status = 'Cuenta creada correctamente!'
          this.contentStatus = 'Bienvenido!!'
          this.loading = false;
          this.route.navigate(['/'])
        }
      })
  }

  tokenError(){
    if(this.tokenInput.controls['token'].hasError('incorrectToken')){
      return "Token no valido"
    }
    if(this.tokenInput.controls['token'].hasError('tokenError')) return 'Token requerido'
    if(this.tokenInput.controls['token'].hasError('max')) return 'Token muy grande'
    return (this.tokenInput.controls['token'].hasError('required'))? 'Token requerido' : ''
  }

  registerToken(){
    this.confirm = true
    if(this.tokenInput.controls['token'].value == this.tokenValue){
      this.backEnd.register(this.registerForm.value).subscribe(x=>{
        if(x.Status == 0){
          this.confirm = false
          this.cookie.set('token', x.Token)
          this.icono = 'check-circle'
          this.status = 'Cuenta creada correctamente!'
          this.contentStatus = 'Bienvenido!!'
          this.loading = false;
        }
      })
    }
    else{
      this.confirm = false
      this.tokenInput.controls['token'].setErrors({'tokenError': true})
    }
  }

  goHome(){
    this.route.navigate([''])
  }

  reloadToken(){
    this.timeLeft = 600
    this.isTimer = true
    this.currentTime = this.getTime(this.timeLeft)
    this.startTimer()
    this.backEnd.activeAccount(this.registerForm.controls['email'].value).subscribe(x=>{
      if(x.Status == 0){
        this.isActivate = true;
        this.tokenValue = x.Token;
        this.status = 'Comprobando su identidad'
        this.contentStatus = 'Estamos verificando su identidad, terminara pronto...'
        this.icono = 'loading'
      }
    })
  }

}
