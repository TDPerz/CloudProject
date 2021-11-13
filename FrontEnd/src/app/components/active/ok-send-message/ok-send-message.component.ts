import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ok-send-message',
  templateUrl: './ok-send-message.component.html',
  styleUrls: ['./ok-send-message.component.scss']
})
export class OkSendMessageComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  gotoHome(){
    this.route.navigate([''])
  }

}
