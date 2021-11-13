import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/service/Api/back-end.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };
  news:Array<any> | undefined

  constructor(private backEnd:BackEndService) {
    this.backEnd.getNews().subscribe(x=>{
      if(x.Status == 0){
        this.news = x.news
      }
    })
  }

  ngOnInit(): void {
  }

}
