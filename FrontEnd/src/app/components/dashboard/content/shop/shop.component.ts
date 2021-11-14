import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @Input()isresp = false;
  @Output()isCollapsed = new EventEmitter<boolean>();
  @Input()iscol = false;
  items: Array<any>;
  expandSet = new Set<number>();
  editModel = false;
  editForm:FormGroup;
  urlIEdit = "error"
  _id = ""
  img:any
  getChange = false;
  files:File[] = []
  isConfirmLoading = false;

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(private backEnd:BackEndService, private route:Router, private message:NzMessageService, private cookie:CookieService, private formB:FormBuilder) {
    this.items = new Array();
    this.backEnd.getShopItems().subscribe(x=>{
      if(x.Status == 0){
        if(x.itemList !== null){
          this.items = x.itemsList
        }
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          cookie.delete('token')
          this.route.navigate(['login'])
        }
      }
    })
    this.editForm = formB.group({
      titleE: new FormControl('',[Validators.required]),
      tagE: new FormControl('',[Validators.required]),
      descE: new FormControl('',[Validators.required]),
      costE: new FormControl('',[Validators.required]),
      inStockE: new FormControl('',[Validators.required]),
      dateE: [null,[Validators.required]],
    })
    this.editForm.valueChanges.subscribe(x=>{
      if(this.editModel){
        this.getChange = true
      }
    })
  }

  ngOnInit(): void {
  }

  callcol(){
    this.iscol = !this.iscol;
    this.isCollapsed.emit(this.iscol)
  }

  reload(){
    this.backEnd.getShopItems().subscribe(x=>{
      if(x.Status == 0){
        if(x.itemList !== null){
          this.items = x.itemsList
        }
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          localStorage.removeItem('token')
          this.route.navigate(['login'])
        }
      }
    })
  }

  editItem(i:any){
    this.editModel = true
    this._id = i._id
    this.img = i.img
    this.editForm.controls['titleE'].setValue(i.title)
    this.editForm.controls['tagE'].setValue(i.tag)
    this.editForm.controls['descE'].setValue(i.desc)
    this.editForm.controls['costE'].setValue(i.cost)
    this.editForm.controls['inStockE'].setValue(i.inStock)
    this.editForm.controls['dateE'].setValue(i.date)
    this.getChange = false
    console.log("se encuentran cambios? " + ((this.getChange)? "si": "no"))
  }

  cancelEdit(){
    if(!this.getChange){
      if(this.files.length == 0){
        console.log("hay una imagen?"+ ((this.files.length == 0)? "si" : "no"))
        console.log("pasa algo?");
        this.editModel = false;
        this._id=""
        this.editForm.reset()
      }
      else{
        this.getChange = true
        this.editModel = true;
      }
    }
    else{
      this.editModel = true;
    }
  }

  submitEdit(){
    this.isConfirmLoading = true
    if(!this.files[0]){
      let d = { 
        img: this.img,
        title: this.editForm.value.titleE,
        desc: this.editForm.value.descE,
        tag: this.editForm.value.tagE,
        date: this.editForm.value.dateE,
        cost: this.editForm.value.costE,
        inStock: this.editForm.value.inStockE
      }
      this.backEnd.editShareItem(this._id,d).subscribe((x:any)=>{
        if(x.Status == 0){
          this.editForm.reset()
          this.message.success(x.Mensaje)
          this.isConfirmLoading = false
          this.img = null
          this._id = ""
          this.reload()
        }
        this.isConfirmLoading = false
        this.editModel = false;
      })
    }
    else{
      let im = ""
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data)
      data.append('upload_preset', 'webVentaRopa')
      data.append('cloud_name', 'sekaijk');
      this.backEnd.uploadImage(data).subscribe((x:any) =>{
        if(x){
          let d = { 
            img:{ url: x.secure_url, public_id: x.public_id},
            title: this.editForm.value.titleE,
            desc: this.editForm.value.descE,
            tag: this.editForm.value.tagE,
            date: this.editForm.value.dateE,
            cost: this.editForm.value.costE,
            inStock: this.editForm.value.inStockE
          }
          this.backEnd.editShareItem(this._id,d).subscribe((x:any)=>{
            if(x.Status == 0){
              this.editForm.reset()
              this.message.success(x.Mensaje)
              this.isConfirmLoading = false
              this.reload()
            }
            this.isConfirmLoading = false
            this.editModel = false;
          })
        }
      })
    }
  }

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  confirmClose(){
    this.editForm.reset();
    this.files = []
    this.editModel = false
  }

  cancelClose(){
    this.editModel = true;
  }

  preview(i:any){
    var url = this.route.serializeUrl(
      this.route.createUrlTree([`/product/${i._id}`])
    );
    window.open(url, '_blank')
  }

  confirmDelet(i:any){
    this.backEnd.deleteShareItem(i._id).subscribe(x =>{
      console.log(x)
      if(x.Status == 0){
        this.message.success("Borrado correctamente");
      }
      else{
        this.message.error("error al borrar");
      }
      this.reload()
    })
  }

  cancelDelet(){
    this.message.info("Cancelado")
  }

}
