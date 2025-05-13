import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all offers
  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offers`);
  }

  // Get a single offer by ID
  getOfferById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/offers/${id}`);
  }

  // Create a new offer
  createOffer(offer: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/offers`, { offer });
  }

  // Update an existing offer
  updateOffer(id: number, offer: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/offers/${id}`, { offer });
  }

  // Delete an offer by ID
  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/offers/${id}`);
  }
}
