import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://hrproject.local/api';

  constructor(private http: HttpClient) {}

  // 🔐 Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // 🔓 Get all applications (needs auth)
  getAllApplications(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/applications`, { headers });
  }

  // Get applications that are NOT withdrawn (needs auth)
  getApplicationsNotWithdrawn(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/applications/not_withdrawn`, { headers });
  }

  // Get applications by Candidat_ID (needs auth)
  getApplicationsByCandidatId(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/applications/by_candidate/${id}`, { headers });
  }

  // Get applications by Offer (needs auth)
  getApplicationsByOfferId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/applications/by_offer/${id}`, { headers });
  }

  // Get a single application by ID (needs auth)
  getApplicationById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/applications/${id}`, { headers });
  }

  // Create a new application (needs auth)
  createApplication(application: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/applications`, application, { headers });
  }

  // Update an existing application (needs auth)
  updateApplication(id: number, application: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/applications/${id}`, application, { headers });
  }

  // Delete an application by ID (needs auth)
  deleteApplication(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/applications/${id}`, { headers });
  }

  // Withdraw Application (needs auth)
  withdrawApplication(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/applications/${id}/withdraw`, { status: 'Withdrawn' }, { headers });
  }

  // Download PDF by ID Application (needs auth)
  downloadPdf(id: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/applications/${id}/download_pdf`, {
        responseType: 'blob',
        headers
      }
    );
  }
}
  