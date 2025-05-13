import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  getAllUsers(){
    return this.http.get(`${this.apiUrl}/users/list`);
  }


  toggleUserActive(id: number) {
    return this.http.patch(`${this.apiUrl}/users/${id}/toggle_active`, {});
  }


  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/show`);
  }

  updateUser(id: number, userData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/update`, userData);
  }
}
