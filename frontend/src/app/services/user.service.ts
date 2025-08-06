import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get all Users
  getAllUsers(){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/list`, { headers });
  }

  // Ban or Unban User (Changing the active field)
  toggleUserActive(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/users/${id}/toggle_active`, {}, { headers });
  }

  // Get a single user by ID
  getUserById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/${id}/show`, { headers });
  }

  // Update an existing user
  updateUser(id: number, userData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/users/${id}/update`, userData, { headers });
  }

  // Delete a User by ID
  deleteUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/users/${id}/delete`, { headers });
  }

  // Get all HR
  getAllHR(){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/list/hr`, { headers });
  }
}
