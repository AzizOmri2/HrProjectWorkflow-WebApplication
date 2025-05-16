import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all applications
  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications`);
  }

  // Get applications by Candidat_ID
  getApplicationsByCandidatId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/by_candidate/${id}`);
  }

  // Get applications by Offer
  getApplicationsByOfferId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/by_offer/${id}`);
  }

  // Get a single application by ID
  getApplicationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/${id}`);
  }

  // Create a new application
  createApplication(application: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/applications`, application );
  }

  // Update an existing application
  updateApplication(id: number, application: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/applications/${id}`, application );
  }

  // Delete an application by ID
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/applications/${id}`);
  }

  // Withdraw Application
  withdrawApplication(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${id}/withdraw`, { status: 'Withdrawn' });
  }

  // Download PDF by ID Application
  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/applications/${id}/download_pdf`, {
      responseType: 'blob',
    });
  }
}
