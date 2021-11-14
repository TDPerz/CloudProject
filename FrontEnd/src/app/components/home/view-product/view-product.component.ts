import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {

  item:any

  formComment:FormGroup
  user:any
  puntaje = 0

  constructor(private act:ActivatedRoute, private route:Router, private backEnd:BackEndService, private fb:FormBuilder, private cookie:CookieService, private jwt: JwtHelperService) {
    this.formComment = fb.group({
      comment:new FormControl('', [ Validators.required])
    })
    this.backEnd.getShopItem(act.snapshot.paramMap.get('product') || '').subscribe(x => {
      if (x.Status == 0) {
        this.item = x.item;
        this.user = jwt.decodeToken(backEnd.getToken())
        console.log("El item es: " + this.item.comment[0].likes[0])
        if(this.user != null){
          this.puntaje = this.getRateMe(this.item.rates, this.user.user)
        }
      }
    })
  }

  ngOnInit(): void {
  }

  /**
   * 
   * @param rates Una lista donde esta la informacion de cuantas estrallas han dado al producto
   * @param userC Usuario de la sescion actual
   * @returns devuelve el puntaje que el usuario dio al producto
   */
  getRateMe(rates: any, userC:string){
    if (!rates) {
      return 0
    }
    userC = userC.toLowerCase()
    var d = rates.filter((it:any) => { return it.user.toLowerCase().includes(userC);})[0]
    return d.rate
  }

  setValue(evento:any){
    if(!this.haveUser()){
      if(evento == 0){
        this.backEnd.deleteRate(this.item._id).subscribe(x=>{
          if(x.Status == 0){
            this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
              if (x.Status == 0) {
                this.item = x.item;
              }
            })
          }
        })  
      }
      else{
        this.backEnd.setRate(this.item._id, evento).subscribe(x=>{
          if(x.Status == 0){
            this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
              if (x.Status == 0) {
                this.item = x.item;
              }
            })
          }
        })
      }
    }
  }

  getRate(){
    if(this.item.rates){
      if(this.item.rates.length == 0){
        return 0
      }
      else{
        return this.item.rawRate/this.item.rates.length
      }
    }
    return 0 
  }

  /**
   * publicar un comentario
   */
  subirComentario(){
    console.log(this.formComment.value.comment)
    this.backEnd.postComment({content:this.formComment.value.comment}, this.item._id).subscribe(x =>{
      console.log(x)
      this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
        if (x.Status == 0) {
          this.item = x.item;
          this.formComment.reset()
        }
      })
    })
  }

  editContent(event:any, comm:any){
    this.backEnd.editComment(event, this.item._id, comm._id).subscribe(x=>{
      if(x.Status == 0){
        this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
          if (x.Status == 0) {
            this.item = x.item;
            this.formComment.reset()
          }
        })
      }
    })
  }

  haveUser(){
    if(this.jwt.decodeToken(this.backEnd.getToken())){
      return false
    }
    else{
      return true
    }
  }

  setLike(comm:any){
    if(this.jwt.decodeToken(this.backEnd.getToken())){
      if(!this.liked(comm)){
        this.backEnd.setLike(this.item._id, comm._id).subscribe(x=>{
          if(x.Status == 0){
            comm = x.Comment
            this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
              if (x.Status == 0) {
                this.item = x.item;
                this.formComment.reset()
              }
            })
          }
        })
      }
      else{
        this.backEnd.setLikent(this.item._id, comm._id).subscribe(x=>{
          this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
            if (x.Status == 0) {
              this.item = x.item;
              this.formComment.reset()
            }
          })
        })
      }
    }else{
      console.log("ya hay like o no esta registrado")
    }
  }

  getLike(comm:any){
    return (comm.likes)? comm.likes.length : 0
  }

  setDislikes(comm:any){
    if(this.jwt.decodeToken(this.backEnd.getToken())){
      if(!this.disLiked(comm)){
        this.backEnd.setDislike(this.item._id, comm._id).subscribe(x=>{
          if(x.Status == 0){
            comm = x.Comment
            this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
              if (x.Status == 0) {
                this.item = x.item;
                this.formComment.reset()
              }
            })
          }
        })
      }else{
        this.backEnd.setDislikent(this.item._id, comm._id).subscribe(x=>{
          this.backEnd.getShopItem(this.act.snapshot.paramMap.get('product') || '').subscribe(x => {
            if (x.Status == 0) {
              this.item = x.item;
              this.formComment.reset()
            }
          })
        })
      }
    }else{
      console.log("ya hay like o no esta registrado")
    }
  }

  getDislikes(comm:any){
    return (comm.dislikes)? comm.dislikes.length : 0
  }

  isEditable(comm:any){
    var user = this.jwt.decodeToken(this.backEnd.getToken())
    if(user){
      if(user.user == comm.user){
        return true
      }
      return false
    }
    return false
  }

  liked(comm:any){
    var user = this.jwt.decodeToken(this.backEnd.getToken())
    if(user){
      var u = user.user
      if(comm != null){
        if (!comm.likes) {
          return false
        }
        u = u.toLowerCase()
        var d = comm.likes.filter((it:any) => { return it.toLowerCase().includes(u);})[0]
        return (d)? true : false
      }
      else{
        return false
      }
    }
    return false
  }

  disLiked(comm:any){
    var user = this.jwt.decodeToken(this.backEnd.getToken())
    if(user){
      var u = user.user
      if (!comm.dislikes) {
        return false
      }
      u = u.toLowerCase()
      var d = comm.dislikes.filter((it:any) => { return it.toLowerCase().includes(u)})[0]
      return (d)? true : false
    }
    return false
  }

}
