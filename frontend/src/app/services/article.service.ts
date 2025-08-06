import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 🔓 Public: Get all articles
  getAllArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/articles`);
  }

  // 🔓 Public: Get single article
  getArticleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`);
  }

  // 🔒 Secured: Create a new article
  createArticle(article: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/articles`, article, { headers });
  }

  // 🔒 Secured: Update an existing article
  updateArticle(id: number, article: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/articles/${id}`, article, { headers });
  }

  // 🔒 Secured: Delete article
  deleteArticle(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`, { headers });
  }

  // 🔒 Secured: Get user's reaction
  getUserReaction(articleId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/articles/${articleId}/article_reaction/user_reaction?user_id=${userId}`, { headers });
  }

  // 🎭 Optional: If you want to secure reactions, also include auth headers in the following

  likeArticle(articleId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/articles/${articleId}/article_reaction/like`,
      { user_id: userId },
      { headers }
    );
  }

  unlikeArticle(articleId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/articles/${articleId}/article_reaction/unlike`,
      { user_id: userId },
      { headers }
    );
  }

  dislikeArticle(articleId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/articles/${articleId}/article_reaction/dislike`,
      { user_id: userId },
      { headers }
    );
  }

  undislikeArticle(articleId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/articles/${articleId}/article_reaction/undislike`,
      { user_id: userId },
      { headers }
    );
  }
}
