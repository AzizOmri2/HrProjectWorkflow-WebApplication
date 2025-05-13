import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-back',
  imports: [CommonModule,RouterModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent implements OnInit{

  isLoggedIn: boolean = true;
  userName: string = '';
  createdAt: string = '';
  role: string = '';
  image: string = '';
  showAlert = true;

  pageTitle = 'Dashboard';
  breadcrumb = 'Dashboard';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userService: UserService
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
      this.userName = storedName;
      const date = new Date(storedDate);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      this.createdAt = `${day}-${month}-${year}`;
      this.role = storedRole;
      if(storedImage == 'null' || storedImage == '' || storedImage == 'defined'){
        this.image = 'uploads/default.jpg';
      } else{
        this.image = storedImage || '';
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

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out successfully', response);
        localStorage.removeItem('auth_token'); // Remove the token
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('created_at');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_image');
        localStorage.removeItem('alert_shown');
        this.isLoggedIn = false;
        window.location.href = '/login'; // Redirect to login page after logout
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }


  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
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
