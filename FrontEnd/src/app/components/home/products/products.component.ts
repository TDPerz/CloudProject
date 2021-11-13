import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  prodAll:Array<any> = []
  rawProd:Array<any> = []
  isNull = false
  nameO = true;
  dateO = true;
  page = 1
  total = 10
  searchText = ""
  prod:Array<any> = []

  constructor(private backEnd:BackEndService, private route:Router) {
    this.backEnd.getShopItems().subscribe(x=>{
      console.log(x)
      if(x.Status == 0){
        console.log(x.itemsList)
        this.rawProd = x.itemsList
        this.viewItmes(x.itemsList);
        this.isNull = false
      }
      else{
        this.isNull = true

      }
    })
  }

  ngOnInit(): void {
  }

  reloadData(){
    this.backEnd.getShopItems().subscribe(x=>{
      if(x.Status == 0){
        this.viewItmes(x.itemsList);
        this.isNull = false
      }
      else{
        this.isNull = true
      }
    })
  }

  viewItmes(itemsList:Array<any>){
    this.total = 0;
    if(itemsList.length > 9){
      var z = 0
      console.log('Iniciamos todo!!')
      var y = itemsList.length
      for(var i = 0; i < itemsList.length; i=i+9){
        if(y < 0){
          break
        }
        else{
          let p = []
          var k = 0
          if(y < 9){
            for(var j = i; j < i+y; j ++){
              p[k] = itemsList[j]
              k++ 
              this.total += 1
            }  
          }
          else{
            for(var j = i; j < i+9; j ++){
              p[k] = itemsList[j]
              k++ 
              this.total += 1
            }
          }
          this.prodAll[z]= p
          z++
        }  
        y = y - 9;
        console.log(y)
      }
      this.page = 1;
      this.prod = this.prodAll[0]
    }
    else{
      this.prod = itemsList
    }
  }

  sortName(){
    if(this.nameO){
      this.rawProd.sort(function(a, b) {
        var textA = a.title;
        var textB = b.title;
        return (textA < textB) ? 1 : (textA > textB) ? -1 : 0
      })
      this.viewItmes(this.rawProd)
    }
    else{
      this.rawProd.sort(function(a, b) {
        var textA = a.title;
        var textB = b.title;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      this.viewItmes(this.rawProd)
    }
    this.nameO = !this.nameO;
  }

  sortDate(){
    if(this.dateO){
      this.rawProd.sort(function(a, b) {
        var textA = a.date;
        var textB = b.date;
        return (textA < textB) ? 1 : (textA > textB) ? -1 : 0
      })
      this.viewItmes(this.rawProd)
    }
    else{
      this.rawProd.sort(function(a, b) {
        var textA = a.date;
        var textB = b.date;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      this.viewItmes(this.rawProd)
    }
    this.dateO = !this.dateO
  }

  getItem(item:any){
    console.log(item._id)
    this.route.navigate(["/product/"+item._id])
  }

  pageChange(event:any){
    console.log(this.prodAll[event - 1])
    this.prod = this.prodAll[event-1]
    this.page = event;
  }

  transform(items: any[], searchText: string){
    if (!items) {
      return []
    }
    if (!searchText) {
      return this.viewItmes(items)
    }
    searchText = searchText.toLowerCase()
    
    return this.viewItmes(items.filter(it => { return it.title.toLowerCase().includes(searchText);})  
    )
  }

}
