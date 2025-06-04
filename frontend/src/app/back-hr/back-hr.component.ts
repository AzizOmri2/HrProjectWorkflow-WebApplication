import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-back-hr',
  imports: [CommonModule, RouterModule],
  templateUrl: './back-hr.component.html',
  styleUrl: './back-hr.component.css'
})
export class BackHrComponent implements OnInit{
  isLoggedIn: boolean = true;
  userName: string = '';
  createdAt: string = '';
  role: string = '';
  image: string = '';
  showAlert = true;

  pageTitle = 'Dashboard';
  breadcrumb = 'Dashboard';
  notifications: any;
  unreadCount = 0;
  userId: number = 0;
  

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}


  

  ngOnInit(): void {
    const alertShown = localStorage.getItem('alert_shown');
    if (!alertShown) {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        localStorage.setItem('alert_shown', 'true'); // Mark as shown
      }, 5000);
    } else {
      this.showAlert = false; // Do not show if already marked
    }

    const storedName = localStorage.getItem('user_name');
    const storedDate = localStorage.getItem('created_at');
    const storedRole = localStorage.getItem('user_role');
    const storedImage = localStorage.getItem('user_image');
    if (storedName && storedDate && storedRole) {
      // Get THE Username
      this.userName = storedName;

      // Get THE Creation Date (Member since ...)
      const date = new Date(storedDate);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      this.createdAt = `${day}-${month}-${year}`;

      // Get THE Role
      if(storedRole === 'rh'){
        this.role = 'HR'
      }else{
        this.role = storedRole;
      }
      
      // Get THE Image
      this.image = storedImage || '';

      // Get THE ID
      const idStr = localStorage.getItem('user_id');
      this.userId = idStr ? +idStr : 0; // Convert to number
      if (this.userId !== null) {
        // Notifications
        this.notificationService.getUnreadNotificationsForUserId(this.userId).subscribe({
          next: (notifications) => {
            this.notifications = notifications;
            this.unreadCount = notifications.length;
          },
          error: (err) => {
            console.error('Error fetching unread notifications:', err);
            this.notifications = [];
            this.unreadCount = 0;
          }
        });
      }
    }
    
    // 🔥 Update title on initial load
    this.updatePageTitle(this.activatedRoute);

    // 🔁 Update title on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle(this.activatedRoute);
      });
  }

  // Helper to get deepest route and set title/breadcrumb
  private updatePageTitle(route: ActivatedRoute) {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const data = child.snapshot.data;
    this.pageTitle = data['title'] || 'Dashboard';
    this.breadcrumb = data['breadcrumb'] || 'Dashboard';
  }


  markAllAsRead(){
    if (this.userId !== 0) {
      this.notificationService.markAllAsReadForUser(this.userId).subscribe({
        next: () => {
          // Refresh notifications after marking as read
          this.notificationService.getAllNotificationsForUserId(this.userId).subscribe({
            next: (notifications) => {
              this.notifications = notifications;
              this.unreadCount = 0;
            }
          });
        },
        error: (err) => {
          console.error('Failed to mark notifications as read:', err);
        }
      });
    }
  }


  // Method to handle deletion of a notification
  deleteNotification(notificationId: number): void {
    if (this.userId === 0) {
      console.error('User ID not available. Cannot delete notification.');
      return;
    }

    // Call the delete API in your service
    this.notificationService.deleteNotification(notificationId, this.userId).subscribe(
      () => {
        // Remove the deleted notification from the list
        this.notifications = this.notifications.filter((notif: any) => notif.id !== notificationId);
      },
      (error) => {
        console.error('Error deleting notification:', error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out successfully', response);
        localStorage.clear();
        this.isLoggedIn = false;
        window.location.href = '/frontvisiteur'; // Redirect to visiteur page after logout
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }


  deleteAccount() {
    const confirmed = window.confirm(
      "⚠️ You're about to delete your account.\n\nThis action is irreversible. Do you want to continue?"
    );
    if (!confirmed) {
      return; // User canceled
    }else{
      const idStr = localStorage.getItem('user_id');
      const id = idStr ? +idStr : null; // Convert to number

      if (id !== null) {
        this.userService.deleteUser(id).subscribe(
          () => {
            this.logout();
          },
          error => {
            console.error('Error deleting User:', error);
          }
        );
      } else {
        console.error('User ID not found in localStorage.');
      }
    }
  }
}
