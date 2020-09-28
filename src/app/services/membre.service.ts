import { Injectable } from '@angular/core';
import {APIService} from './api.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Membre} from '../models/membre';

@Injectable({
  providedIn: 'root'
})
export class MembreService extends APIService {

  baseurl = `${environment.apiUrl}/membre/`;
  constructor(public http: HttpClient) {
    super(http);
  }

}
