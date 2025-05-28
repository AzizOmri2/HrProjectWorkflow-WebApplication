import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFunnel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/funnel`);
  }

  getTimeToHire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/time_to_hire`);
  }

  getDiversity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/diversity`);
  }
}
