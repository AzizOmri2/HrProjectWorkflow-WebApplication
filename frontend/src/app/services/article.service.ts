import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all articles
  getAllArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/articles`);
  }

  // Get a single article by ID
  getArticleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`);
  }

  // Create a new article
  createArticle(article: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/articles`, article );
  }

  // Update an existing article
  updateArticle(id: number, article: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/articles/${id}`, article );
  }

  // Delete an article by ID
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`);
  }
}
