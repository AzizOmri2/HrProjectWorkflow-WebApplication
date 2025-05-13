import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all Users
  getAllUsers(){
    return this.http.get(`${this.apiUrl}/users/list`);
  }

  // Ban or Unban User (Changing the active field)
  toggleUserActive(id: number) {
    return this.http.patch(`${this.apiUrl}/users/${id}/toggle_active`, {});
  }

  // Get a single user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/show`);
  }

  // Update an existing user
  updateUser(id: number, userData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/update`, userData);
  }

  // Delete a User by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}/delete`);
  }

  // Get all HR
  getAllHR(){
    return this.http.get(`${this.apiUrl}/users/list/hr`);
  }
}
