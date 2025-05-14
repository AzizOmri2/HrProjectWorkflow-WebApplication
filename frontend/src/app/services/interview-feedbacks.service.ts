import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewFeedbacksService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all interview feedbacks
  getAllInterviewFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/interview_feedbacks`);
  }

  // Get a single interview feedback by ID
  getInterviewFeedbackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interview_feedbacks/${id}`);
  }

  // Get a interview feedback by IDInterview
  getInterviewFeedbacksByIdInterview(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/interview_feedbacks/${id}/interview_feedback`);
  }

  // Create a new interview feedback
  createInterviewFeedbacks(interview_feedback: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/interview_feedbacks`, interview_feedback );
  }

  // Update an existing interview feedback
  updateInterviewFeedback(id: number, interview_feedback: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/interview_feedbacks/${id}`, interview_feedback );
  }

  // Delete an interview feedback by ID
  deleteInterviewFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/interview_feedbacks/${id}`);
  }

}
