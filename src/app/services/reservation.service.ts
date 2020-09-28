import { Injectable } from '@angular/core';
import {APIService} from './api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CalendarEvent} from 'angular-calendar';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends APIService{

  baseurl = `${environment.apiUrl}/reservation/`;
  constructor(public http: HttpClient) {
    super(http);
  }

  getall(params?){
    return this.http.get(this.baseurl, {params});
  }
}
