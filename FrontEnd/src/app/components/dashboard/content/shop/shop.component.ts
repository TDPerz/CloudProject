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
    this.urlIEdit = i.img
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
    let img = "";
    console.log("hay algun cambio? " + ((this.getChange)? "Si": "no "))
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
