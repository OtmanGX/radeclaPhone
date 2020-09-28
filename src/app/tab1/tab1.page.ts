import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user';

const TITLE = 'Profile';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  title = TITLE;
  user: User;
  constructor(
      service: AuthService
  ) {
    service.getCurrentUser().subscribe(user => this.user = user);
  }

}
