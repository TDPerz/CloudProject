import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CookieService } from 'ngx-cookie-service';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  items: Array<any>;
  a = 1
  isVisible = false;
  showEdit = false;
  edititem: any;
  oldId:string = "";
  newItemForm:FormGroup;
  shareForm:FormGroup;
  isConfirmLoading = false;
  isVisibleShare = false;
  fileList:NzUploadFile[] = [];
  loading = false;
  avatarUrl: string = "";
  @Input()isresp = false;
  @Output()isCollapsed = new EventEmitter<boolean>();
  @Input()iscol = false;
  files: File[] = [];


  constructor(private backEnd:BackEndService, private route:Router, private fb: FormBuilder, private message: NzMessageService, private cookie:CookieService) {
    this.items = new Array<any>();
    this.isCollapsed.emit(true)
    this.edititem = {id_Name:"",tag:"",cost:"",inStock:""};
    this.backEnd.getInventoy().subscribe((x:any)=>{
      if(x.Status == 0){
        this.items = x.itemsList;
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          cookie.delete('token')
          this.route.navigate(['login'])
        }
      }
    })
    this.newItemForm = fb.group({
      idNameN: new FormControl('',[Validators.required]),
      tagN: new FormControl('',[Validators.required]),
      costN: new FormControl('',[Validators.required]),
      inStockN: new FormControl('',[Validators.required])
    })
    this.shareForm = fb.group({
      titleS: new FormControl('',[Validators.required]),
      tagS: new FormControl('',[Validators.required]),
      desc: new FormControl('',[Validators.required]),
      costS: new FormControl('',[Validators.required]),
      inStockS: new FormControl('',[Validators.required]),
      date: [null,[Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  callcol(){
    this.iscol = !this.iscol;
    this.isCollapsed.emit(this.iscol)
  }

  reload(){
    this.backEnd.getInventoy().subscribe((x: any) =>{
      if(x.Status == 0){
        this.items = x.itemsList;
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          this.cookie.delete('token');
          this.route.navigate(['login'])
        }
      }
    })
  }

  showDialogEdit(i:any){
    this.edititem = Object.assign({},i);
    this.oldId = i._id;
    this.showEdit = true;
  }

  applyChange(){
    this.isConfirmLoading = true
    this.backEnd.editItem(this.edititem,this.oldId).subscribe((x:any)=>{
      this.isConfirmLoading = false
      this.showEdit = false
      if(x.Status == 0){
        this.message.success(x.Mensaje)
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          localStorage.removeItem('token')
          this.route.navigate(['login'])
        }
      }
      this.reload()
    })
  }

  showDialog() {
    this.isVisible = true;
  }

  handleOk() {
    this.isConfirmLoading = true;
    this.backEnd.addItem({ id_Name:this.newItemForm.controls['idNameN'].value, tag: this.newItemForm.controls['tagN'].value, cost:this.newItemForm.controls['costN'].value, inStock:this.newItemForm.controls['inStockN'].value}).subscribe((x:any)=>{
      this.isConfirmLoading = false
      this.isVisible = false;
      if(x.Status == 0){
        console.log("Subido correctamente")
        this.message.success(x.Mensaje)
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          localStorage.removeItem('token')
          this.route.navigate(['login'])
        }
      }
      this.reload()
    })
  }

  handleCancel() {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  showMenssage(type:string, mensaje:string){
    this.message.create(type, mensaje)
  }

  deletData(i:any){
    this.backEnd.deleteItem(i._id).subscribe((x:any)=>{
      if(x.Status == 0){
        this.message.success(x.Mensaje)
      }
      else{
        if(x.Status == 100){
          this.message.error(x.Mensaje)
          localStorage.removeItem('token')
          this.route.navigate(['login'])
        }
      }
      this.reload()
    })
  }

  cancel(){
    this.message.info("Cancel")
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.fileList.concat(file)
    return true;
  };

  //Share
    
  onSelect(event:any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  showSharing(i:any){
    this.shareForm.controls['titleS'].setValue(i.id_Name)
    this.shareForm.controls['tagS'].setValue(i.tag)
    this.shareForm.controls['inStockS'].setValue(i.inStock)
    this.shareForm.controls['date'].setValue(formatDate(new Date(), 'yyyy/MM/dd', 'en'))
    this.isVisibleShare = true
  }

  async shareItem(){
    this.isConfirmLoading = true
    if(!this.files[0]){
      this.message.error("No image")
      this.isConfirmLoading = false
    }
    else{
      let im = ""
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data)
      data.append('upload_preset', 'webVentaRopa')
      data.append('cloud_name', 'sekaijk');
      await this.backEnd.uploadImage(data).subscribe((x:any) =>{
        if(x){
          let d = { "d": this.shareForm.value, img:{ url: x.secure_url, public_id: x.public_id} }
          this.backEnd.shareItem(d).subscribe((x:any)=>{
            if(x.Status == 0){
              console.log(x.Mensaje)          
              this.files= []
              this.shareForm.reset()
              this.isVisibleShare = false
              this.message.success(x.Mensaje)
              this.isConfirmLoading = false
            }
            this.isConfirmLoading = false
          })
        }
      })
    }
  }

  canelShare(){
    this.files= []
    this.shareForm.reset()
    this.isVisibleShare = false
    this.avatarUrl = ""
  }

}
