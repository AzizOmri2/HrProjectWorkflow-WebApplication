import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all comments
  getAllComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comments`);
  }

  // Get a single comment by ID
  getCommentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comments/${id}`);
  }

  // Get comments by ID Article
  getCommentsByIdArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comments/${id}/by_id_article`);
  }

  // Create a new comment
  createComment(comment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments`, comment );
  }

  // Update an existing comment
  updateComment(id: number, comment: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/comments/${id}`, comment );
  }

  // Delete a comment by ID
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`);
  }
}
