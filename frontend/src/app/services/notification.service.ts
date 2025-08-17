import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://203.0.113.53:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all notifications for userId
  getAllNotificationsForUserId(id: any): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/notifications`, { headers });
  }


  // Get unread notifications for userId(new ones)
  getUnreadNotificationsForUserId(id: any): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/notifications/unread`, { headers });
  }

  // Mark all read for userId
  markAllAsReadForUser(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/users/${userId}/notifications/mark-all-read`, {}, { headers });
  }


  // Delete Notification
  deleteNotification(id: number, userId:number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/users/${userId}/notifications/${id}`, { headers });
  }



  /*

  // Get a single notification by ID
  getNotificationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notifications/${id}`);
  }

  // Update an existing notification
  updateNotification(id: number, notification: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/notifications/${id}`, notification );
  }

  // Delete a notification by ID
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/${id}`);
  }
    
  
  */
}
