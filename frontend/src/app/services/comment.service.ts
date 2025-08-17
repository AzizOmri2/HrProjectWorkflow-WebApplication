import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 🔓 Get all comments
  getAllComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comments`);
  }

  // 🔓 Get a single comment by ID
  getCommentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comments/${id}`);
  }

  // 🔓 Get comments by article ID
  getCommentsByIdArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comments/${id}/by_id_article`);
  }

  // 🔒 Create a new comment
  createComment(comment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/comments`, comment, { headers });
  }

  // 🔒 Update an existing comment
  updateComment(id: number, comment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/comments/${id}`, comment, { headers });
  }

  // 🔒 Delete a comment by ID
  deleteComment(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`, { headers });
  }
}
