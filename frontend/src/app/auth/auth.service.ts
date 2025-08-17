import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://203.0.113.53:3000';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  register(name: string, email: string, password: string, role: string, image:string, active:boolean): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, {
      user: { name, email, password, password_confirmation: password, role, image, active }
    }, { observe: 'response' }).pipe(
      tap(response => this.setToken(response))
    );
  }


  // ✅ Admin adds any type of user with full control
  createUserByAdmin(name: string, email: string, password: string, role: string, image: string, active: boolean, gender: string, birth_date: string, nationality: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/users/admin`, {
      user: { name, email, password, password_confirmation: password, role, image, active, gender, birth_date, nationality }
    }, { headers });
  }

  login(email: string, password: string): Observable<any> {
    const body = { user: { email, password } };
    return this.http.post<any>(`${this.apiUrl}/users/sign_in`, body);
  }

  logout(): Observable<any> {
    // Your API endpoint for logging out if needed (optional)
    return this.http.delete<any>(`${this.apiUrl}/users/sign_out`);
  }

  updatePassword(id: number, password: string) {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/users/update_password`, {
      id,password
    }, { headers });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem("user_role");
  }

  private setToken(response: HttpResponse<AuthResponse>): void {
    const token = response.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  verifyPassword(password: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/users/verify_password`, 
      { password }, 
      { headers }
    );
  }


  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/password`, 
      { user: { email } },
      { headers: { 'Accept': 'application/json' } }
    );
  }

  resetPassword(token: string, password: string, passwordConfirmation: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/password`, {
      user: {
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation
      }
    });
  }
}
