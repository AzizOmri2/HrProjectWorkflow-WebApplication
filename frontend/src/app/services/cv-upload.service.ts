import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvUploadService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  // Upload CV For Parsing to Complete Profile
  uploadCv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token'); // Adjust as needed

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/cv_parser/upload`, formData, { headers });
  }

  // Fetch user profile from backend
  getProfile(): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Adjust as needed

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/cv_parser/profile`, { headers });
  }

  // Update user profile on backend
  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Adjust as needed

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/cv_parser/profile`, profileData, { headers });
  }
}
