import { Component, OnInit } from '@angular/core';
import {IonRouterOutlet} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private routerOutlet: IonRouterOutlet,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
