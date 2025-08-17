import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get all profiles (auth required)
  getAllProfiles(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/profiles`, { headers });
  }

  // Get a single profile by ID (auth required)
  getProfileById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/profiles/${id}`, { headers });
  }

  // Create a new profile (auth required)
  createProfile(profile: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/profiles`, { profile }, { headers });
  }

  // Update a profile (auth required)
  updateProfile(id: number, profile: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/profiles/${id}`, { profile }, { headers });
  }

  // Delete a profile (auth required)
  deleteProfile(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/profiles/${id}`, { headers });
  }
}
