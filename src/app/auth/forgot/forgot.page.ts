import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
	email:string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
  	console.log('email: '+this.email);
  }

}
