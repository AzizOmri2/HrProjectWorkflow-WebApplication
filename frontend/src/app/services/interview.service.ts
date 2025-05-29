import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all interviews
  getAllInterviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/interviews`);
  }

  // Get a single interview by ID
  getInterviewById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interviews/${id}`);
  }

  // Get a single interview by user_id
  getInterviewByIdUser(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interviews/by_user/${user_id}`);
  }

  // Create a new interview
  createInterview(interview: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/interviews`, interview );
  }

  // Update an existing interview
  updateInterview(id: number, interview: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/interviews/${id}`, interview );
  }

  // Delete an interview by ID
  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/interviews/${id}`);
  }


  // ✅ Method to validate an interview (Accept)
  validateInterviewAccept(interviewId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.put(`${this.apiUrl}/interviews/${interviewId}/accept`, {}, { headers });
  }


  // ✅ Method to validate an interview (Reject)
  validateInterviewReject(interviewId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.put(`${this.apiUrl}/interviews/${interviewId}/reject`, {}, { headers });
  }
}
