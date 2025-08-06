import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole(); // Returns 'admin', 'rh', or 'candidate'

      if (role === 'admin') {
        this.router.navigate(['/back']);
      } else if (role === 'rh') {
        this.router.navigate(['/back-hr']);
      } else {
        this.router.navigate(['/front']);
      }

      return false; // Block access to the current route
    }

    // Not logged in → allow to proceed to visitor front page
    return true;
  }
}
