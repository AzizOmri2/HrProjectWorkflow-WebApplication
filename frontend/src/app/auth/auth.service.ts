import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string, role: string, image:string, active:boolean): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, {
      user: { name, email, password, password_confirmation: password, role, image, active }
    }, { observe: 'response' }).pipe(
      tap(response => this.setToken(response))
    );
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
    return this.http.put<any>(`${this.apiUrl}/users/update_password`, {
      id,password
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
}
