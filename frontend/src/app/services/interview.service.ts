import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  // 🔐 Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  // 🔐 Get all interviews
  getAllInterviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/interviews`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Get a single interview by ID
  getInterviewById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interviews/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Get interviews by user ID
  getInterviewByIdUser(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interviews/by_user/${user_id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Create a new interview
  createInterview(interview: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/interviews`, interview, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Update an interview
  updateInterview(id: number, interview: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/interviews/${id}`, interview, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Delete an interview
  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/interviews/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Accept an interview
  validateInterviewAccept(interviewId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/interviews/${interviewId}/accept`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔐 Reject an interview
  validateInterviewReject(interviewId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/interviews/${interviewId}/reject`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
