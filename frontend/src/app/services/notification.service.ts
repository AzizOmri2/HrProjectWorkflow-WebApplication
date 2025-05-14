import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // Get all notifications for userId
  getAllNotificationsForUserId(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/notifications`);
  }


  // Get unread notifications for userId(new ones)
  getUnreadNotificationsForUserId(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/notifications/unread`);
  }

  // Mark all read for userId
  markAllAsReadForUser(userId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/notifications/mark-all-read`, {});
  }


  // Delete Notification
  deleteNotification(id: number, userId:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/notifications/${id}`);
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
