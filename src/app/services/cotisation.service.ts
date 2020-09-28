import { Injectable } from '@angular/core';
import {APIService} from './api.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CotisationService extends APIService {

  baseurl = `${environment.apiUrl}/cotisations/`;
  constructor(public http: HttpClient) {
    super(http);
  }

}
