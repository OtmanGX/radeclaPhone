import { Injectable } from '@angular/core';
import {APIService} from './api.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends APIService {

  baseurl = `${environment.apiUrl}/dashboard/`;
  constructor(public http: HttpClient) {
    super(http);
  }

  get(): Observable<any> {
    return this.http.get(`${this.baseurl}`);
  }

  terrain_stats(params) {
    return this.http.get(`${this.baseurl}terrains`,{params: params});
  }

}
