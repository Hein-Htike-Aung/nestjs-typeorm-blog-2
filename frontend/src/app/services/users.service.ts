import { UserData, _User } from './../model/app.model';
import { map, Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<_User> {
    return this.http.get(`${API}/${id}`).pipe(
      map((user: _User) => user)
    )
  }

  findAll(page: number, limit: number): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<UserData>(`${API}`, { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(() => err))
    );
  }

  paginateByName({ username, limit, page = 0 }: { username: string, limit: number, page?: number }): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('username', username);

    return this.http.get<UserData>(`${API}`, { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(() => err))
    );
  }
}
