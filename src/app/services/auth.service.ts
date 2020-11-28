import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User} from '../models/user';
import { LocalStorageService } from './local-storage.service';

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject(null);

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) { }

  login(form: {username: string; password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/token/`, form)
      .pipe(
        tap(response => {
          // this.user$.next({id: 1, username: 'admin'});
          this.setToken('token', response.access);
          this.setToken('refreshToken', response.refresh);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = this.localStorageService.getItem('token');
    // if there is token then fetch the current user
    if (token) { return true; }
    return false;
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.user$.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap(user => {
        // check if we already have user data
        if (user) {
          return of(user);
        }

        const token = this.localStorageService.getItem('token');
        // if there is token then fetch the current user
        if (token) {
          // return this.user$.next({id:1, username: 'admin'});
          return this.fetchCurrentUser();
        }

        return of(null);
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/hello/`)
      .pipe(
        tap(user => {
          this.user$.next({id: user.id,
              username: user.username,
              fullName: user.membre?.nom,
              // tel: user?.membre.tel,
              // mail: user?.membre.mail,
              // membreId: user?.membre.id,
              // dateNaissance: user?.membre.date_naissance
          });
        })
      );
  }

  refreshToken(): Observable<{access: string; refresh: string}> {
    const refreshToken = this.localStorageService.getItem('refreshToken');

    return this.http.post<{access: string; refresh: string}>(
      `${environment.apiUrl}/api/token/refresh/`,
      {
        refreshToken
      }).pipe(
        tap(response => {
          this.setToken('token', response.access);
          this.setToken('refreshToken', response.refresh);
        })
    );
  }

  private setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }
}
