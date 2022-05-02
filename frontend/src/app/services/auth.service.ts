import { LoginPayload, _User } from './../model/app.model';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginPayload: LoginPayload): Observable<any> {

    return this.http.post<any>(`${API}/login`, loginPayload).pipe(
      map((token) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }

  register(user: _User): Observable<any> {
    return this.http.post<any>(`${API}`, user);
  }

}