import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get all offers (no auth required)
  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offers`);
  }

  // Get a single offer by ID (no auth required)
  getOfferById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/offers/${id}`);
  }

  // Create a new offer (auth required)
  createOffer(offer: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/offers`, { offer }, { headers });
  }

  // Update an existing offer (auth required)
  updateOffer(id: number, offer: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/offers/${id}`, { offer }, { headers });
  }

  // Delete an offer by ID (auth required)
  deleteOffer(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/offers/${id}`, { headers });
  }

  // ✅ New method to fetch AI-based recommended offers
  // Get recommended offers for candidate (auth required)
  getRecommendedOffersForCandidate(userId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/recommendations/${userId}`, { headers });
  }
}
