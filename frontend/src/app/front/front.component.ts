import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { OfferService } from '../services/offer.service';

declare var $: any;

@Component({
  selector: 'app-front',
  imports: [CommonModule,RouterModule],
  templateUrl: './front.component.html',
  styleUrl: './front.component.css'
})
export class FrontComponent implements OnInit{

  pageTitle = 'Home';
  breadcrumb = 'Home';

  showAlert = true;

  userId: number = 0;
  isLoggedIn: boolean = true;
  userName: string = '';
  createdAt: string = '';
  role: string = '';
  image: string = '';
  
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {}


    notifications:any;
    notificationCount: number = 0;


    openNotifications() {
      // Using Renderer2 to add 'show' class to modal (similar to Bootstrap 'modal' behavior)
      const modal = this.el.nativeElement.querySelector('#notificationModal');
      this.renderer.addClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'block');
      this.renderer.setStyle(modal, 'overflow', 'auto');

      const idStr = localStorage.getItem('user_id');
      this.userId = idStr ? +idStr : 0;

      if (this.userId !== 0) {
        this.notificationService.markAllAsReadForUser(this.userId).subscribe({
          next: () => {
            // Refresh notifications after marking as read
            this.notificationService.getAllNotificationsForUserId(this.userId).subscribe({
              next: (notifications) => {
                this.notifications = notifications;
                this.notificationCount = 0;
              }
            });
          },
          error: (err) => {
            console.error('Failed to mark notifications as read:', err);
          }
        });
      }
    }

    closeModal() {
      const modal = this.el.nativeElement.querySelector('#notificationModal');
      this.renderer.removeClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'none');
      this.renderer.setStyle(modal, 'overflow', 'hidden');
    }
  
    
  
    ngOnInit(): void {
      const alertShown = localStorage.getItem('alert_shown');
      this.showAlert = !alertShown;

      const storedName = localStorage.getItem('user_name');
      const storedDate = localStorage.getItem('created_at');
      const storedRole = localStorage.getItem('user_role');
      const storedImage = localStorage.getItem('user_image');
      if (storedName && storedDate && storedRole) {
        this.userName = storedName;
        
        //ID
        const idStr = localStorage.getItem('user_id');
        const id = idStr ? +idStr : null; // Convert to number
        if (id !== null) {
          // Notifications
          this.notificationService.getUnreadNotificationsForUserId(id).subscribe({
            next: (notifications) => {
              this.notifications = notifications;
              this.notificationCount = notifications.length;
            },
            error: (err) => {
              console.error('Error fetching unread notifications:', err);
              this.notifications = [];
              this.notificationCount = 0;
            }
          });
        }

        //Date
        const date = new Date(storedDate);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        //Created At
        this.createdAt = `${day}-${month}-${year}`;

        //Role
        this.role = storedRole;

        //Image
        this.image = storedImage || '';
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
      this.pageTitle = data['title'] || 'Home';
      this.breadcrumb = data['breadcrumb'] || 'Home';
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
        window.location.href = '/frontvisiteur'; // Redirect to login page after logout
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }

}
