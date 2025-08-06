import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private inactivityTimeout: any;
  private inactivityTime = 2 * 60 * 1000; // 2 minutes

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.resetInactivityTimer();
  }

  // Listen to all user interactions
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:mousedown')
  @HostListener('document:touchstart')
  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.handleInactivity();
    }, this.inactivityTime);
  }

  handleInactivity(): void {
    if (!localStorage.getItem('auth_token')) return;
    const currentUrl = this.router.url;

    // Don't redirect if already on lock screen
    if (currentUrl !== '/lock') {
      this.router.navigate(['/lock']);
    }
  }
}