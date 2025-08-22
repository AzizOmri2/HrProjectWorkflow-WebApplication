import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewFeedbacksService {

  private apiUrl = 'http://192.168.49.2:30030';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get all interview feedbacks
  getAllInterviewFeedbacks(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/interview_feedbacks`, { headers });
  }

  // Get a single interview feedback by ID
  getInterviewFeedbackById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/interview_feedbacks/${id}`, { headers });
  }

  // Get a interview feedback by IDInterview
  getInterviewFeedbacksByIdInterview(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/interview_feedbacks/${id}/interview_feedback`, { headers });
  }

  // Create a new interview feedback
  createInterviewFeedbacks(interview_feedback: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/interview_feedbacks`, interview_feedback , { headers });
  }

  // Update an existing interview feedback
  updateInterviewFeedback(id: number, interview_feedback: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/interview_feedbacks/${id}`, interview_feedback , { headers });
  }

  // Delete an interview feedback by ID
  deleteInterviewFeedback(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/interview_feedbacks/${id}`, { headers });
  }

}
